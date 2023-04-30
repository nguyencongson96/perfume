import Products from "#root/model/products.model.js";
import Pagination from "#root/config/product/pagination.config.js";
import keyQuery from "#root/config/product/keyQuery.config.js";
import asyncWrapper from "#root/middleware/async.middleware.js";
import _throw from "#root/utils/throw.js";
import convertMatchCondition from "../../utils/convertMatchCondition.js";
import mongoose from "mongoose";

const { limit } = Pagination;

const getProductsByFilter = asyncWrapper(async (req, res) => {
  const query = req.query;

  const matchCondition = Object.entries(query).reduce((obj, [key, value]) => {
    return {
      ...obj,
      ...(!keyQuery.uncompare.includes(key) &&
        (value.includes("-")
          ? { $and: convertMatchCondition(value.split("-"), key) } // if value includes '-', use $and operator
          : value.includes(".")
          ? { $or: convertMatchCondition(value.split("."), key) } // if value includes '.', use $or operator
          : convertMatchCondition(value.split(), key)[0])), // else do not use and or or operator
    };
  }, {});

  // Find products that match the query object
  const products = (
    await Products.aggregate(
      [
        //filter to match conditions
        { $match: matchCondition },

        //Sort by one of 2 fields are price or name
        query.sort
          ? {
              $sort: {
                [query.sort.slice(0, 1) === "p" ? "price" : "name"]: query.sort.slice(1, 3) === "ac" ? 1 : -1,
              },
            }
          : false,

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

        //Get random product, and auto set random number is limit
        query.random ? { $sample: { size: limit } } : false,

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
              $push: {
                _id: "$list._id",
                name: "$list.name",
                image: "$list.image",
                price: "$list.price",
                stock: "$list.stock",
              },
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

  return res.status(200).json(products);
});

export default getProductsByFilter;
