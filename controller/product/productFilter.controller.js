import Products from "../../model/products.model.js";
import Pagination from "../../config/filter/pagination.config.js";
import keyQuery from "../../config/filter/filterKey.config.js";
import sortConfig from "../../config/filter/sortStyle.config.js";
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
  // If the key contains an include comparison symbol
  else if (keyQuery.includeCompare.includes(key))
    // Return an array of objects with a regular expression
    return arr.map((item) => ({ [key]: new RegExp(item, "i") }));
  // If the key does not contain a comparison symbol
  // Return an array of objects with a regular expression that matches exactly
  else return arr.map((item) => ({ [key]: new RegExp(`^${item}$`, "i") }));
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

    //Check whether have to filter field or not
    query.field &&
      query.field.split("-").some((field) => !keyQuery.all.includes(field)) &&
      _throw(400, "Invalid field Query");

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
                  ? { $and: convertMatchCond(value.split("-"), key) }
                  : value.includes(".")
                  ? { $or: convertMatchCond(value.split("."), key) }
                  : convertMatchCond(value.split(), key)[0]),
              });
            return obj;
          }, {}),
        },
        //Get specific fields want to get
        query.field
          ? {
              $project: query.field.split("-").reduce((obj, val) => {
                return { ...obj, [val]: 1 };
              }, {}),
            }
          : false,
        //Get random product
        query.random ? { $sample: { size: limit } } : false,
        //Sort
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
        //Remove pipeline does not appear in client request
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
