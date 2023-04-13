import mongoose from "mongoose";
import Orders from "../../model/orders.model.js";
import Users from "../../model/users.model.js";
import _throw from "../throw.js";
import keyQuery from "../../config/order/keyQuery.config.js";
import orderStatus from "../../config/order/status.config.js";
import currentTime from "../../config/currentTime.js";
import asyncWrapper from "../../middleware/async.middleware.js";
import updateCart from "./updateCart.js";
import { isArray, isEmpty } from "../checkType.js";

const handleOrderByUser = {
  getOneOrder: asyncWrapper(async (req, res) => {
    const { id } = req.params;

    //Find order based on id params
    const foundOrder = await Orders.findById(id);
    if (!foundOrder) return res.status(204).json(`Cannot find Order`);

    //Throw error if cannot find user
    const foundUser = await Users.findOne({ username: req.user }).exec();
    const userId = foundUser._id;
    userId.toString() !== foundOrder.userId.toString() &&
      _throw(401, "Permission is not granted");

    return res.status(200).json(foundOrder);
  }),
  addNewOrder: asyncWrapper(async (req, res) => {
    const { status, cart, name, address, phone } = req.body;

    //Check whether cart is an array or not
    !isArray(cart)
      ? _throw(400, "Invalid cart")
      : isEmpty(cart) && _throw(400, "Cannot submit blank cart");

    //Check whether staus valid or not
    !orderStatus.updatebyUser.includes(status) && _throw(400, "Invalid status");

    //In case user logins, get userId of the user, otherwise, create a new one
    const userId = (
      !req.user
        ? await new mongoose.Types.ObjectId()
        : (await Users.findOne({ username: req.user }))._id
    ).toString();

    //Check whether user try to add new pending order or not
    status === "Pending"
      ? !req.user
        ? //In case user does not login, throw error if user try to add order with status Pending
          _throw(400, "Invalid status when not login")
        : //In case user logins, throw error if user try to add another Pending Order when they already have one
          (await Orders.findOne({ userId, status: "Pending" })) &&
          _throw(400, "An user have only one Pending Order")
      : //Check whether all necessary field is filled or not when order status is not pending
        keyQuery.add.forEach(
          (field) => !field && _throw(400, `Require ${field}`)
        );

    //Update cart in order
    const { total, cart: newCart } = await updateCart(status, cart);

    // Create a new order and return it as JSON data
    const createdCart = await Orders.create({
      userId,
      name,
      phone,
      address,
      status,
      total,
      cart: newCart,
      createdAt: currentTime(),
      ...(status !== "Pending" && {
        lastUpdateAt: currentTime(),
        submitAt: currentTime(),
      }),
    });
    return res.status(201).json(createdCart);
  }),
  getOrders: asyncWrapper(async (req, res) => {
    // Search for a order with the given id
    const foundOrders = await Orders.find({
      userId: (await Users.findOne({ username: req.user }, { userId: 0 }))._id,
    }).exec();

    return foundOrders.length === 0
      ? res.status(204).json(`There is no order yet`) // If there's no order has matched username, return a 204 status code with a message saying that there is no cart matched
      : res.status(200).json({ total: foundOrders.length, list: foundOrders }); // Otherwise, return a 200 status code with the found order as a JSON object in the response body
  }),
  getPendingOrder: asyncWrapper(async (req, res) => {
    //Find Pending order based on userId and Pending status
    const foundOrder = await Orders.findOne(
      {
        userId: (await Users.findOne({ username: req.user }))._id,
        status: "Pending",
      },
      { userId: 0 }
    ).exec();

    //If there is no Pending order, send status code 204
    return !foundOrder
      ? res.status(204).json(`User does not have any pending order`)
      : res.status(200).json(foundOrder);
  }),
  updateOrder: asyncWrapper(async (req, res) => {
    const { status, cart } = req.body;

    //Check if status valid or not
    status &&
      !orderStatus.updatebyUser.includes(status) &&
      _throw(400, "Invalid Status");

    //Check whether cart is an array or not
    !isArray(cart)
      ? _throw(400, "Invalid cart")
      : isEmpty(cart) && _throw(400, "Cannot update to blank cart");

    //Find Pending Order
    const foundOrder = await Orders.findOne({
      userId: (await Users.findOne({ username: req.user }))._id,
      status: "Pending",
    });
    if (!foundOrder)
      return res.status(204).json(`Cannot find an Pending Order`);

    //In case user update order but status still is pending
    if (status === "Pending")
      keyQuery.update.forEach((key) => {
        const value = req.body[key];
        value && (foundOrder[key] = value);
      });
    //In case user update order status to Dispatched, address, name, phone, status is required. Throw error if lacking one of them, else, update all
    else {
      keyQuery.update.forEach((key) => {
        const value = req.body[key];
        value ? (foundOrder[key] = value) : _throw(400, `Require ${key}`);
      });
      foundOrder.submitAt = currentTime();
    }

    //Update Order
    const { total, cart: newCart } = await updateCart(status, cart);
    foundOrder.cart = newCart;
    foundOrder.total = total;
    foundOrder.lastUpdateAt = currentTime();

    // Return the updated order
    const updateCart = await foundOrder.save();
    return res.status(200).json(updateCart);
  }),
  deleteOrder: asyncWrapper(async (req, res) => {
    //Find and delete order of logged in user in pending state
    const foundOrder = await Orders.findOneAndDelete({
      userId: (await Users.findOne({ username: req.user }))._id,
      status: "Pending",
    }).exec();

    //Check if there is any pending order to delete or not
    !foundOrder
      ? res.status(204).json(`There is no order in pending state`)
      : res.status(200).json(`Cart pending has been deleted`);
  }),
};

export default handleOrderByUser;
