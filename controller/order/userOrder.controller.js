import Orders from "../../model/orders.model.js";
import Products from "../../model/products.model.js";
import Users from "../../model/users.model.js";
import _throw from "../throw.js";
import keyQuery from "../../config/order/keyQuery.config.js";
import orderStatus from "../../config/order/status.config.js";
import currentTime from "../../config/currentTime.js";

const handleOrderByUser = {
  getOneOrder: async (req, res) => {
    try {
      const { id } = req.params;

      //Find order based on id params
      const foundOrder = await Orders.findById(id);
      if (!foundOrder)
        return res.status(204).json({ msg: `Cannot find Order` });

      //Throw error if cannot find user
      const foundUser = await Users.findOne({ username: req.user }).exec();
      const userId = foundUser._id;
      userId.toString() !== foundOrder.userId.toString() &&
        _throw(401, "Permission is not granted");

      return res.status(200).json(foundOrder);
    } catch (err) {
      console.log(err);
      err.status
        ? res.status(err.status).json(err.msg)
        : req.status(500).json("Error while getting an order");
    }
  },
  addNewOrder: async (req, res) => {
    try {
      const { status, cart, name, address, phone } = req.body;

      //Check whether cart is an array or not
      !Array.isArray(cart)
        ? _throw(400, "Invalid cart")
        : cart.length === 0 && _throw(400, "Cannot submit blank cart");

      //Check whether staus valid or not
      !orderStatus.updatebyUser.includes(status) &&
        _throw(400, "Invalid status");

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
      let total = 0;
      for (const item of cart) {
        const { productId, quantity, capacity } = item;

        // Check if there is a product matching the productId in the database
        const foundProduct = await Products.findById(productId);
        if (!foundProduct) _throw(400, `No product matches id ${productId}`);

        //Find position of capacity in array
        const capacityIndex = foundProduct.capacity.findIndex(
          (i) => i === Number(capacity)
        );
        capacityIndex < 0 && _throw(400, `Invalid capacity`);

        //Get price
        item.price = foundProduct.price[capacityIndex];

        //Get quantity and save
        let { name, stock } = foundProduct;
        quantity > stock && _throw(400, `Not enough stock of ${name}`);
        status !== "Pending" && (stock[capacityIndex] -= quantity);
        await foundProduct.save();

        //Set total
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
        createdAt: currentTime(),
        ...(status !== "Pending" && {
          lastUpdateAt: currentTime(),
          submitAt: currentTime(),
        }),
      });
      return res.status(201).json(newCart);
    } catch (err) {
      console.log(err);
      err.name === "ValidationError"
        ? res.status(400).json(
            Object.keys(err.errors).reduce((obj, key) => {
              obj[key] = err.errors[key].message;
              return obj;
            }, {})
          )
        : err.status
        ? res.status(err.status).json(err.msg)
        : res.status(500).send("Error occurred while adding new order");
    }
  },
  getOrders: async (req, res) => {
    try {
      // Search for a order with the given id
      const foundOrders = await Orders.find({
        userId: (
          await Users.findOne({ username: req.user }, { userId: 0 })
        )._id,
      }).exec();

      return foundOrders.length === 0
        ? res.status(204).json({ msg: `There is no order yet` }) // If there's no order has matched username, return a 204 status code with a message saying that there is no cart matched
        : res
            .status(200)
            .json({ total: foundOrders.length, list: foundOrders }); // Otherwise, return a 200 status code with the found order as a JSON object in the response body
    } catch (err) {
      console.log(err);
      err.status
        ? res.status(err.status).json(err.msg)
        : req.status(500).json("Error while getting orders");
    }
  },
  getPendingOrder: async (req, res) => {
    try {
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
        ? res.status(204).json({ msg: `Cannot find Order` })
        : res.status(200).json(foundOrder);
    } catch (err) {
      console.log(err);
      err.status
        ? res.status(err.status).json(err.msg)
        : req.status(500).json("Error while getting pending order");
    }
  },
  updateOrder: async (req, res) => {
    try {
      const { status, cart } = req.body;

      //Check if status valid or not
      status &&
        !orderStatus.updatebyUser.includes(status) &&
        _throw(400, "Invalid Status");

      //Check whether cart is an array or not
      !Array.isArray(cart)
        ? _throw(400, "Invalid cart")
        : cart.length === 0 && _throw(400, "Cannot update to blank cart");

      //Find Pending Order
      const foundOrder = await Orders.findOne({
        userId: (await Users.findOne({ username: req.user }))._id,
        status: "Pending",
      });
      if (!foundOrder)
        return res.status(204).json({ msg: `Cannot find an Pending Order` });

      //In case user update order status to Dispatched, address, name, phone, status is required. Throw error if lacking one of them, else, update all
      keyQuery.update.forEach((key) => {
        const value = req.body[key];
        value
          ? (foundOrder[key] = value)
          : status !== "Pending" && _throw(400, `Require ${key}`);
      });

      //Reinstall products in order
      foundOrder.cart = [];
      foundOrder.total = 0;
      for (const { productId, quantity, capacity } of cart) {
        //Find product
        const foundProduct = await Products.findById(productId);
        !foundProduct && _throw(400, `No product matches id ${productId}`);

        //Find position of capacity in array
        const capacityIndex = foundProduct.capacity.findIndex(
          (ele) => ele === capacity
        );
        capacityIndex < 0 && _throw(400, `Invalid capacity`);

        //Update price
        const price = foundProduct.price[capacityIndex];

        //Update stock
        let stock = foundProduct.stock[capacityIndex];
        //Throw error if stock does not have enough product for the order
        stock < quantity &&
          _throw(400, `Not enough stock of ${foundProduct.name}`);
        //If status is not pending then minus quantity in stock
        status !== "Pending" && (stock -= quantity);

        //Push product to order, calculate total price of order, and only minus stock if status is no longer Pending
        foundOrder.cart.push({ productId, quantity, capacity, price });
        foundOrder.total += quantity * price;
      }

      //Update time
      foundOrder.lastUpdateAt = currentTime();
      status !== "Pending" && (foundOrder.submitAt = currentTime());

      // Return the updated order
      const updateCart = await foundOrder.save();
      return res.status(200).json(updateCart);
    } catch (err) {
      console.log(err);
      err.name === "ValidationError"
        ? res.status(400).json(
            Object.keys(err.errors).reduce((obj, key) => {
              obj[key] = err.errors[key].message;
              return obj;
            }, {})
          )
        : err.status
        ? res.status(err.status).json(err.msg)
        : res.status(500).send("Error occurred while updating order");
    }
  },
  deleteOrder: async (req, res) => {
    try {
      //Find and delete order of logged in user in pending state
      const foundOrder = await Orders.findOneAndDelete({
        userId: (await Users.findOne({ username: req.user }))._id,
        status: "Pending",
      }).exec();

      //Check if there is any pending order to delete or not
      !foundOrder
        ? res.status(204).json(`There is no order in pending state`)
        : res.status(200).json(`Cart pending has been deleted`);
    } catch (err) {
      console.log(err);
      err.status
        ? res.status(err.status).json(err.msg)
        : req.status(500).json("Error while deleting pending order");
    }
  },
};

export default handleOrderByUser;
