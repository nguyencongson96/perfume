import Products from "#root/model/products.model.js";
import Pagination from "#root/config/product/pagination.config.js";
import keyQuery from "#root/config/product/keyQuery.config.js";
import asyncWrapper from "#root/middleware/async.middleware.js";
import _throw from "#root/utils/throw.js";
import convertMatchCondition from "../../utils/convertMatchCondition.js";

const { limit } = Pagination;

const getProductsByFilter = asyncWrapper(async (req, res) => {
  const query = req.query;

  const matchCondition = Object.entries(query).reduce((obj, [key, value]) => {
    if (!keyQuery.uncompare.includes(key)) {
      // if value includes '-', use $and operator
      if (value.includes("-")) {
        const newCondition = convertMatchCondition(value.split("-"), key);
        obj.$and = !obj.$and ? newCondition : [...obj.$and, ...newCondition];
      }
      // if value includes '.', use $or operator
      else if (value.includes(".")) {
        const newCondition = convertMatchCondition(value.split("."), key);
        obj.$or = !obj.$or ? newCondition : [...obj.$or, ...newCondition];
      }
      // else do not use and or or operator
      else {
        obj = { ...obj, ...convertMatchCondition(value.split(), key)[0] };
      }
    }
    return obj;
  }, {});
  console.log(matchCondition);

  // Find products that match the query object
  const products = (
    await Products.aggregate(
      [
        //filter to match conditions
        { $match: matchCondition },

        //Get random product, and auto set random number is limit
        query.random ? { $sample: { size: Number(query.random || limit) } } : false,

        // Paginate the results
        query.page > 1 ? { $skip: limit * (query.page - 1) } : false,
        query.page ? { $limit: limit } : false,

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

  return res.status(200).json(products);
});

export default getProductsByFilter;
