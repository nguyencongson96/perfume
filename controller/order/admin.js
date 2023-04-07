import Orders from "../../model/Orders.js";
import Products from "../../model/Products.js";
import _throw from "../throw.js";
import { keyQuery, orderStatus } from "../../config/keyQuery.js";

const handleOrderByAdmin = {
  getOrders: async (req, res) => {
    try {
      // Search for all orders
      const foundOrders = await Orders.find().exec();

      // If there is no order with that id, return a 204 status code with a message saying that there is no cart match id
      if (!foundOrders)
        return res.status(204).json({ msg: `There is no order yet` });

      // Otherwise, return a 200 status code with the found order as a JSON object in the response body
      return res
        .status(200)
        .json({ total: foundOrders.length, list: foundOrders });
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error while getting orders list" });
    }
  },
  getOneOrder: async (req, res) => {
    const { id } = req.params;
    try {
      const foundOrder = await Orders.findById(id);

      //Response 204 if cannot find the order
      if (!foundOrder)
        return res.status(204).json({ msg: `Cannot find Order` });
      return res.status(200).json(foundOrder);
    } catch {
      console.log(err);
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error while getting an order" });
    }
  },
  updateOrder: async (req, res) => {
    try {
      const { id } = req.params,
        { status } = req.body;

      // Throw error if id value is invalid
      !id && _throw(400, "Id is required");
      typeof id !== "string" && _throw(400, "Invalid Id");

      //Throw error if status value is invalid
      status &&
        !orderStatus.updatebyAdmin.includes(status) &&
        _throw(400, "Invalid status");

      //Response 204 if cannot find the order
      const foundOrder = await Orders.findById(id);
      if (!foundOrder)
        return res.status(204).json({ msg: `Cannot find Order` });

      //Check for each case of former status
      switch (foundOrder.status) {
        case "Cancelled":
          _throw(400, "Cannot update cancelled order");
          break;
        default:
          //If user want to update status from (not Pending, not Cancelled) to Cancelled
          if (status === "Cancelled") {
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
          break;
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
};

export default handleOrderByAdmin;
