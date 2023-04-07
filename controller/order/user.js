import Orders from "../../model/Orders.js";
import Products from "../../model/Products.js";
import Users from "../../model/Users.js";
import _throw from "../throw.js";
import { keyQuery, orderStatus } from "../../config/keyQuery.js";

const handleOrderByUser = {
  getOrders: async (req, res) => {
    try {
      //Check user login or not
      const user = req.user;
      !user && _throw(401, "Unauthorized");

      // Search for a order with the given id
      const foundOrders = await Orders.find({
        userId: (await Users.findOne({ username: user }, { userId: 0 }))._id,
      }).exec();

      // If there is no order with that id, return a 204 status code with a message saying that there is no cart match id
      if (foundOrders.length === 0)
        return res.status(204).json({ msg: `There is no order yet` });

      // Otherwise, return a 200 status code with the found order as a JSON object in the response body
      return res
        .status(200)
        .json({ total: foundOrders.length, list: foundOrders });
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error while getting orders" });
    }
  },
  getPendingOrder: async (req, res) => {
    try {
      //Check if user login or not
      const user = req.user;
      !user && _throw(401, "Unauthorized");

      //Find Pending order based on userId and Pending status
      const foundOrder = await Orders.findOne({
        userId: (await Users.findOne({ username: user }))._id,
        status: "Pending",
      }).exec();

      //If there is no Pending order, send status code 204
      if (!foundOrder)
        return res.status(204).json({ msg: `Cannot find Order` });
      else return res.status(200).json(foundOrder);
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error while getting an order" });
    }
  },
  getOneOrder: async (req, res) => {
    try {
      const { id } = req.params;

      //Check user login or not
      const user = req.user;
      !user && _throw(401, "Unauthorized");

      //Find order based on id params
      const foundOrder = await Orders.findById(id);
      if (!foundOrder)
        return res.status(204).json({ msg: `Cannot find Order` });

      //Throw error if cannot find user
      const foundUser = await Users.findOne({ username: user }).exec();
      const userId = foundUser._id;
      userId.toString() !== foundOrder.userId.toString() &&
        _throw(401, "Permission is not granted");

      return res.status(200).json(foundOrder);
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error while getting an order" });
    }
  },
  addNewOrder: async (req, res) => {
    try {
      const { status, cart, name, address } = req.body;
      let { phone } = req.body;
      // Throw an error if the order information is not provided
      (!cart || !status) && _throw(400, "cart and status are required");

      // Throw an error if the order information is not an array
      !Array.isArray(cart) && _throw(400, "Invalid order infor");

      // Throw an error if invalid status
      !orderStatus.updatePending.includes(status) &&
        _throw(400, "Invalid status");

      //In case user is not login, create random userId and if user do not give phone number, throw error
      let userId = "";
      if (!req.user) {
        userId = await new mongoose.Types.ObjectId().toString();
        status !== "Dispatched" && _throw(400, "Invalid status when not login");
        !phone && _throw(400, "Require phone when user is not login");

        //In case user is login, throw error if user try to add another Pending Order when they already have one, or user did not add address info
      } else {
        const foundUser = await Users.findOne({ username: req.user }).exec();
        userId = foundUser._id.toString();
        if (status === "Pending")
          (await Orders.findOne({ userId, status: "Pending" })) &&
            _throw(400, "An user have only one Pending Order");
        else
          (!address || !name) && _throw(400, "Name and address are required");
        !phone && (phone = foundUser.phone);
      }

      //Update cart in order
      let total = 0;
      for (const item of cart) {
        let { productId, quantity, capacity } = item;
        // Throw an error if invalid product information
        if (
          !productId ||
          !quantity ||
          !capacity ||
          !Number(quantity) ||
          !Number(capacity) ||
          quantity < 1
        )
          _throw(400, "Invalid product information");

        // Check if there is a product matching the productId in the database
        const foundProduct = await Products.findById(productId);
        if (!foundProduct) _throw(400, `No product matches id ${productId}`);

        // Throw an error if there is not enough stock for a product in the order
        if (quantity > foundProduct.stock)
          _throw(400, `Not enough stock of ${foundProduct.name}`);

        // Get the price of the item based on its capacity
        const capacityIndex = foundProduct.capacity.findIndex(
          (i) => i === Number(capacity)
        );

        if (capacityIndex < 0) _throw(400, "Invalid capacity");
        else item.price = foundProduct.price[capacityIndex];

        // Update stock of product and calculate total price of order
        if (status !== "Pending") foundProduct.stock[capacityIndex] -= quantity;
        await foundProduct.save();
        total += quantity * item.price;
      }

      // Create a new order and return it as JSON data
      const newCart = await Orders.create({
        userId,
        name,
        phone,
        address,
        status,
        total,
        cart,
      });
      return res.status(201).json(newCart);
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error while adding an order" });
    }
  },
  updateOrder: async (req, res) => {
    try {
      const { status, cart, name, phone, address } = req.body;

      //Check if user login or not
      const user = req.user;
      !user && _throw(401, "Unauthorized");

      //Check if status valid or not
      status &&
        !orderStatus.updatebyUser.includes(status) &&
        _throw(400, "Invalid Status");

      //Find Pending Order
      const foundOrder = await Orders.findOne({
        userId: (await Users.findOne({ username: user }))._id,
        status: "Pending",
      });
      if (!foundOrder)
        return res.status(204).json({ msg: `Cannot find an Pending Order` });

      //In case user update order status to Dispatched, address is required
      status !== "Pending" &&
        (!address || !name || !phone) &&
        _throw(400, "Infor is required");

      //Reinstall products in order
      foundOrder.cart = [];
      foundOrder.total = 0;
      for (const item of cart) {
        const { productId, quantity, capacity } = item;

        //Check valid input product
        (!productId ||
          (quantity && (!Number(quantity) || quantity < 1)) ||
          (capacity && !Number(capacity))) &&
          _throw(400, "Invalid product information");

        //Find product
        const foundProduct = await Products.findById(productId);
        !foundProduct && _throw(400, `No product matches id ${productId}`);

        //Find position of capacity in array
        const capacityIndex = foundProduct.capacity.findIndex(
          (ele) => ele === capacity
        );
        //Check valid capacity
        capacityIndex < 0 && _throw(400, `Invalid capacity`);

        let price = foundProduct.price[capacityIndex],
          stock = foundProduct.stock[capacityIndex],
          name = foundProduct.name;

        //Check stock
        stock < quantity && _throw(400, `Not enough stock of ${name}`);

        //Push product to order, calculate total price of order, and only minus stock if status is no longer Pending
        foundOrder.cart.push({ productId, quantity, capacity, price });
        foundOrder.total += quantity * price;
        status !== "Pending" && (stock -= quantity);
      }
      // Save the updated order
      const updateKey = keyQuery.orderKey.update;
      updateKey.forEach((key) => {
        const value = req.body[key];
        value && (foundOrder[key] = value);
      });

      // Return the updated order
      const updateCart = await foundOrder.save();
      return res.status(200).json(updateCart);
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error while updating an order" });
    }
  },
  deleteOrder: async (req, res) => {
    try {
      //Check user login or not
      const user = req.user;
      !user && _throw(401, "Unauthorized");

      //Find and delete order of logged in user in pending state
      const foundOrder = await Orders.findOneAndDelete({
        userId: (await Users.findOne({ username: user }))._id,
        status: "Pending",
      }).exec();

      //Check if there is any pending order to delete or not
      if (!foundOrder)
        return res
          .status(204)
          .json({ msg: `There is no order in pending state` });

      return res.status(200).json({ msg: `Cart pending has been deleted` });
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error while removing an order" });
    }
  },
};

export default handleOrderByUser;
