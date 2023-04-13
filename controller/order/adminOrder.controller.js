import Orders from "../../model/orders.model.js";
import Products from "../../model/products.model.js";
import _throw from "../throw.js";
import keyQuery from "../../config/order/keyQuery.config.js";
import orderStatus from "../../config/order/status.config.js";
import asyncWrapper from "../../middleware/async.middleware.js";
import { isString } from "../checkType.js";

const handleOrderByAdmin = {
  getOrders: asyncWrapper(async (req, res) => {
    // Search for all orders
    const foundOrders = await Orders.find().exec();

    // If there is no order with that id, return a 204 status code with a message saying that there is no cart match id
    if (!foundOrders)
      return res.status(204).json({ msg: `There is no order yet` });

    // Otherwise, return a 200 status code with the found order as a JSON object in the response body
    return res
      .status(200)
      .json({ total: foundOrders.length, list: foundOrders });
  }),
  getOneOrder: asyncWrapper(async (req, res) => {
    const { id } = req.params;

    const foundOrder = await Orders.findById(id);

    //Response 204 if cannot find the order
    if (!foundOrder) return res.status(204).json({ msg: `Cannot find Order` });
    return res.status(200).json(foundOrder);
  }),
  updateOrder: asyncWrapper(async (req, res) => {
    const { id } = req.params,
      { status } = req.body;

    // Throw error if id value is invalid
    !id && _throw(400, "Id is required");
    isString(id) && _throw(400, "Invalid Id");

    //Throw error if status value is invalid
    status &&
      !orderStatus.updatebyAdmin.includes(status) &&
      _throw(400, "Invalid status");

    //Response 204 if cannot find the order
    const foundOrder = await Orders.findById(id);
    if (!foundOrder) return res.status(204).json(`Cannot find Order`);

    //Check for each case of former status
    if (foundOrder.status === "Cancelled")
      _throw(400, "Cannot update cancelled order");
    else if (status === "Cancelled") {
      //Increase stock of each product
      for (const item of foundOrder.cart) {
        const { productId, quantity, capacity } = item,
          foundProduct = await Products.findById(productId),
          capacityIndex = foundProduct.capacity.findIndex(
            (ele) => ele === capacity
          );
        foundProduct.stock[capacityIndex] += quantity;
        await foundProduct.save();
      }
    }

    // Save the updated order
    keyQuery.update.forEach((key) => {
      const value = req.body[key];
      value && (foundOrder[key] = value);
    });

    // Return the updated order
    const updateOrder = await foundOrder.save();
    return res.status(200).json(updateOrder);
  }),
};

export default handleOrderByAdmin;
