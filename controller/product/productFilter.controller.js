import Products from "../../model/products.model.js";
import Pagination from "../../config/product/pagination.config.js";
import keyQuery from "../../config/product/keyQuery.config.js";
import sortConfig from "../../config/product/sortStyle.config.js";
import _throw from "../throw.js";

const { limit } = Pagination;

/**
 * Converts an array of values to an array of objects that can be used in a MongoDB query.
 * @param {Array} arr - The array of values to convert.
 * @param {String} key - The key to use in the objects.
 * @returns {Array} An array of objects that can be used in a MongoDB query.
 */
const convertMatchCond = (arr, key) => {
  // Object containing comparison symbols
  const compareSymbol = {
    min: "$gte",
    max: "$lte",
    greater: "$gt",
    lower: "$lt",
  };
  // If the key contains a number comparison symbol
  if (keyQuery.numberCompare.some((item) => key.includes(item))) {
    // Find the comparison symbol in the key
    const foundCompare = Object.keys(compareSymbol).find((compare) =>
      key.includes(compare)
    );
    return foundCompare
      ? arr.map((item) => ({
          [key.replace(foundCompare, "")]: {
            [compareSymbol[foundCompare]]: Number(item),
          },
        })) // Return an array of objects with the comparison symbol and number if a comparison symbol was found
      : arr.map((item) => ({ [key]: { $eq: Number(item) } })); // Return an array of objects with a number that is equal to the item
  }
  // If the key does not contain a number comparison symbol
  else
    return keyQuery.includeCompare.includes(key) //If the key contains an include comparison symbol
      ? arr.map((item) => ({ [key]: new RegExp(item, "i") })) // Return an array of objects with a regular expression
      : arr.map((item) => ({ [key]: new RegExp(`^${item}$`, "i") })); // Return an array of objects with a regular expression that matches exactly
};

const getProductsByFilter = async (req, res) => {
  try {
    const query = req.query,
      keyArr = Object.keys(query);

    //Check whether req.query has any key-value pairs or not
    keyArr.length === 0 && _throw(400, "Query Params is required");

    //Check whether query has any key match allowKey array, if not send status 400
    !keyArr.every((val) => keyQuery.filter.some((key) => val.includes(key))) &&
      _throw(400, "Invalid key Query");

    //Check sort value
    query.sort &&
      !Object.values(sortConfig).includes(query.sort) &&
      _throw(400, "Invalid sort Query");

    //Check slice value
    query.page &&
      (!Number(query.page) || query.page < 1) &&
      _throw(400, "Invalid page Query");

    // Find products that match the query object
    const products = await Products.aggregate(
      [
        //Add filter
        {
          $match: Object.entries(query).reduce((obj, [key, value]) => {
            !keyQuery.uncompare.includes(key) &&
              (obj = {
                ...obj,
                ...(value.includes("-")
                  ? { $and: convertMatchCond(value.split("-"), key) } // if value includes '-', use $and operator
                  : value.includes(".")
                  ? { $or: convertMatchCond(value.split("."), key) } // if value includes '.', use $or operator
                  : convertMatchCond(value.split(), key)[0]), // else do not use and or or operator
              });
            return obj;
          }, {}),
        },
        //Auto only get 4 fields defined in keyQuery
        {
          $project: keyQuery.getList.reduce((obj, val) => {
            return { ...obj, [val]: 1 };
          }, {}),
        },
        //Get random product, and auto set random number is limit
        query.random ? { $sample: { size: limit } } : false,
        //Sort by one of 2 fields are price or name
        query.sort
          ? {
              $sort: {
                [query.sort.slice(0, 1) === "p" ? "price" : "name"]:
                  query.sort.slice(1, 3) === "ac" ? 1 : -1,
              },
            }
          : false,
        //Slice
        query.page > 1 ? { $skip: limit * (query.page - 1) } : false,
        query.page ? { $limit: limit } : false,
        //Remove pipeline does not appear in request
      ].filter(Boolean)
    );

    res.status(200).json({
      total: products.length,
      ...(query.page && { page: Number(query.page) }),
      ...(query.page && { limit: Math.min(limit, products.length) }),
      list: products,
    });
  } catch (err) {
    console.log(err);
    err.status
      ? res.status(err.status).json(err.msg)
      : res.status(500).json("Error occurred while filtering");
  }
};

export default getProductsByFilter;
