import Products from "../../model/products.model.js";
import mergeSort from "./sort.js";
import Pagination from "../../config/filter/pagination.config.js";
import keyQuery from "../../config/filter/filterKey.config.js";
import sortConfig from "../../config/filter/sortStyle.config.js";
import _throw from "../throw.js";

const { limit } = Pagination;

// This function takes a string as an argument and returns an object with a comparison operator and a number.
const compareSymbol = (arr, key) => {
  if (keyQuery.numberCompare.includes(key))
    return arr.map((item) => {
      return {
        [key]:
          item.slice(0, 2) === ">="
            ? { $gte: Number(item.slice(2)) }
            : item.slice(0, 2) === "<="
            ? { $lte: Number(item.slice(2)) }
            : item.slice(0, 1) === ">"
            ? { $gt: Number(item.slice(1)) }
            : item.slice(0, 1) === "<"
            ? { $lt: Number(item.slice(1)) }
            : { $eq: Number(item) },
      };
    });
  else if (keyQuery.includeCompare.includes(key))
    return arr.map((item) => {
      return { [key]: new RegExp(item, "i") };
    });
  else
    return arr.map((item) => {
      return { [key]: new RegExp(`^${item}$`, "i") };
    });
};

const getProductsByFilter = async (req, res) => {
  try {
    const query = req.query,
      queryArr = Object.entries(query),
      keyArr = Object.keys(query);

    //Check whether req.query has any key-value pairs or not
    keyArr.length === 0 && _throw(400, "Query Params is required");

    //Check whether query has any key match allowKey array, if not send status 400
    !keyArr.every((val) => keyQuery.filter.includes(val)) &&
      _throw(400, "Invalid key Query");

    //Check whether have to filter field or not
    const fieldArr = !query.field ? [] : query.field.split("-");
    fieldArr.length > 0 &&
      !fieldArr.every((field) => keyQuery.all.includes(field)) &&
      _throw(400, "Invalid field Query");

    //Check sort value
    const sortVal = query.sort;
    sortVal &&
      !Object.values(sortConfig).includes(sortVal) &&
      _throw(400, "Invalid sort Query");

    //Check slice value
    const page = query.page;
    page && (!Number(page) || page < 1) && _throw(400, "Invalid page Query");

    // Find products that match the query object
    const products = await Products.aggregate(
      [
        //Add filter
        {
          $match: queryArr.reduce((obj, [key, value]) => {
            !keyQuery.uncompare.includes(key) &&
              (obj = {
                ...obj,
                ...(value.includes("-")
                  ? { $and: compareSymbol(value.split("-"), key) }
                  : value.includes(".")
                  ? { $or: compareSymbol(value.split("."), key) }
                  : compareSymbol(value.split(), key)[0]),
              });
            return obj;
          }, {}),
        },
        //Get specific fields want to get
        fieldArr.length === 0
          ? false
          : {
              $project: fieldArr.reduce((obj, val) => {
                return { ...obj, [val]: 1 };
              }, {}),
            },
        //Get random product
        !query.random ? false : { $sample: { size: limit } },
        //Sort
        !sortVal
          ? false
          : {
              $sort: {
                [sortVal.slice(0, 1) === "p" ? "price" : "name"]:
                  sortVal.slice(1, 3) === "ac" ? 1 : -1,
              },
            },
      ].filter((pipe) => pipe !== false)
    );

    const sliceList = !page
      ? products
      : products.slice((page - 1) * limit, page * limit);

    res.status(200).json({
      total: sliceList.length,
      page: !page ? "all" : Number(page),
      limit: !page ? false : Math.min(limit, sliceList.length),
      list: sliceList,
    });
  } catch (err) {
    console.log(err);
    res
      .status(err.status || 500)
      .json({ msg: err.msg || "Error occurred while filtering" });
  }
};

export default getProductsByFilter;
