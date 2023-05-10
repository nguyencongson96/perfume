import Orders from "#root/model/orders.model.js";
import Products from "#root/model/products.model.js";
import _throw from "#root/utils/throw.js";
import orderStatus from "#root/config/order/status.config.js";
import asyncWrapper from "#root/middleware/async.middleware.js";
import Pagination from "#root/config/product/pagination.config.js";
import convertMatchCondition from "../../utils/convertMatchCondition.js";
import keyQuery from "#root/config/order/keyQuery.config.js";

const { limit } = Pagination;

const handleOrderByAdmin = {
  getOrders: asyncWrapper(async (req, res) => {
    // Search for all orders
    const foundOrders = await Orders.find().exec();

    // If there is no order with that id, return a 204 status code with a message saying that there is no cart match id
    if (!foundOrders) return res.status(204).json({ msg: `There is no order yet` });

    // Otherwise, return a 200 status code with the found order as a JSON object in the response body
    return res.status(200).json({ total: foundOrders.length, list: foundOrders });
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

    //Throw error if status value is invalid
    foundOrder.status === "Cancelled" && _throw(400, "Cannot update cancelled order");
    status && !orderStatus.updatebyAdmin.includes(status) && _throw(400, "Invalid status");

    //Response 204 if cannot find the order
    const foundOrder = await Orders.findById(id);
    !foundOrder && _throw(404, `Cannot find Order`);

    //Check for each case of former status
    if (status === "Cancelled") {
      //Increase stock of each product
      for (const item of foundOrder.cart) {
        const { productId, quantity, capacity } = item,
          foundProduct = await Products.findById(productId),
          capacityIndex = foundProduct.capacity.findIndex((ele) => ele === capacity);
        foundProduct.stock[capacityIndex] += quantity;
        await foundProduct.save();
      }
    }

    // Save the updated order
    Object.assign(foundOrder, req.body);

    // Return the updated order
    const updateOrder = await foundOrder.save();

    return res.status(200).json(updateOrder);
  }),
  filterOrders: asyncWrapper(async (req, res) => {
    const query = req.query;

    const matchCondition = Object.entries(query).reduce((obj, [key, value]) => {
      return {
        ...obj,
        ...(keyQuery.filter.includes(key) && convertMatchCondition(value.split(), key)[0]), // else do not use and or or operator
      };
    }, {});
    console.log(matchCondition);

    // Find orders that match the query object
    const orders = (
      await Orders.aggregate(
        [
          //filter to match conditions
          { $match: matchCondition },

          //Get total product meet the condition and get remove unnecessary field of each product
          {
            $facet: {
              totalCount: [{ $count: "total" }],
              list: [
                {
                  $project: keyQuery.getList.reduce((obj, val) => {
                    return { ...obj, [val]: 1 };
                  }, {}),
                },
              ],
            },
          },

          //Deconstructs array of field totalCount and list
          { $unwind: "$totalCount" },
          { $unwind: "$list" },

          // Paginate the results
          query.page > 1 ? { $skip: limit * (query.page - 1) } : false,
          query.page ? { $limit: limit } : false,

          // Replace the root of the results
          {
            $replaceRoot: {
              newRoot: {
                total: "$totalCount.total",
                pages: { $ceil: { $divide: ["$totalCount.total", limit] } },
                list: "$list",
              },
            },
          },

          // Group the results again
          {
            $group: {
              _id: "$total",
              total: { $avg: "$total" },
              numberOfPages: { $avg: "$pages" },
              list: {
                $push: keyQuery.getList.reduce((obj, val) => {
                  return { ...obj, [val]: `$list.${val}` };
                }, {}),
              },
            },
          },

          // Remove the ID field from the results
          { $unset: "_id" },

          // Add fields to the results
          query.page && { $addFields: { pageNumber: Number(query.page) } },
          query.page && { $addFields: { productNumber: { $min: [limit, { $size: "$list" }] } } },

          //Remove pipeline does not appear in request
        ].filter(Boolean)
      )
    )[0];
    return res.status(200).json(orders);
  }),
};

export default handleOrderByAdmin;
