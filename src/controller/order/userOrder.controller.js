import mongoose from "mongoose";
import Orders from "#root/model/orders.model.js";
import Users from "#root/model/users.model.js";
import _throw from "#root/utils/throw.js";
import orderStatus from "#root/config/status.config.js";
import currentTime from "#root/utils/currentTime.js";
import asyncWrapper from "#root/middleware/async.middleware.js";
import updateCart from "#root/utils/updateCart.js";

const handleOrderByUser = {
  getOneOrder: asyncWrapper(async (req, res) => {
    const { id } = req.params;

    //Find order based on id params
    const foundOrder = await Orders.findById(id).lean();
    if (!foundOrder) return res.status(204).json(`Cannot find Order`);

    //Throw error if cannot find user
    const foundUser = await Users.findOne({ username: req.user }).lean().exec();
    const userId = foundUser._id;
    userId.toString() !== foundOrder.userId.toString() && _throw(401, "Permission is not granted");

    return res
      .status(200)
      .json(
        !foundOrder.cart || foundOrder.cart.length === 0
          ? foundOrder
          : { ...foundOrder, ...(await updateCart(foundOrder.status, foundOrder.cart)) }
      );
  }),
  addNewOrder: asyncWrapper(async (req, res) => {
    const { status, cart } = req.body,
      time = currentTime();

    //Check whether cart is an array or not
    cart.length === 0 && _throw(400, "Cannot submit blank cart");

    //Check status
    orderStatus.updatebyUser.every((key) => key !== status) && _throw(400, "Invalid status");

    //In case user logins, get userId of the user, otherwise, create a new one
    const userId = !req.user
      ? await new mongoose.Types.ObjectId()
      : (await Users.findOne({ username: req.user }))._id;

    //Check whether user try to add new pending order or not
    status === "Pending" &&
      (!req.user
        ? //In case user does not login, throw error if user try to add order with status Pending
          _throw(400, "Invalid status when not login")
        : //In case user logins, throw error if user try to add another Pending Order when they already have one
          (await Orders.findOne({ userId, status: "Pending" })) &&
          _throw(400, "An user have only one Pending Order"));

    //Update cart in order
    const { total, cart: newCart } = await updateCart(status, cart);

    // Create a new order and return it as JSON data
    const createdCart = await Orders.create({
      ...req.body,
      userId,
      status,
      total,
      cart: newCart.detail,
      createdAt: time,
      ...(status !== "Pending" && { lastUpdateAt: time, submitAt: time }),
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
      { _id: 1, status: 1, total: 1, cart: 1 }
    )
      .lean()
      .exec();

    console.log(foundOrder);

    //If there is no Pending order, send status code 204
    return !foundOrder || !foundOrder.cart || foundOrder.cart.length === 0
      ? res.status(200).json(`User does not have any pending order`)
      : res.status(200).json({ ...foundOrder, ...(await updateCart(foundOrder.status, foundOrder.cart)) });
  }),
  updateOrder: asyncWrapper(async (req, res) => {
    const { status, cart } = req.body,
      time = currentTime();

    //Check whether cart is an array or not
    cart.length === 0 && _throw(400, "Cannot update to blank cart");

    //Find Pending Order
    const foundOrder = await Orders.findOne({
      userId: (await Users.findOne({ username: req.user }))._id,
      status: "Pending",
    });
    if (!foundOrder) return res.status(204).json(`Cannot find an Pending Order`);

    //Update Order
    const { total, cart: newCart } = await updateCart(status, cart);
    Object.assign(
      foundOrder,
      req.body,
      { total, cart: newCart.detail },
      { lastUpdateAt: time },
      status !== "Pending" && { submitAt: time }
    );

    // Return the updated order
    await foundOrder.save();

    return res.status(200).json(foundOrder);
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
