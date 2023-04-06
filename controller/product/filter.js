import Products from "../../model/Products.js";
import mergeSort from "./sort.js";
import Pagination from "../../config/pagination.js";
import keyQuery from "../../config/keyQuery.js";
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

const getProductsByFilter = {
  bySearchName: async (req, res) => {
    try {
      const query = req.query,
        keyArr = Object.keys(query);

      //Check whether req.query has any key-value pairs or not
      keyArr.length === 0 && _throw(400, "Query Params is required");

      //Check whether query has any key match allowKey array, if not send status 400
      !keyArr.every((val) => keyQuery.search.includes(val)) &&
        _throw(400, "Invalid key of Query");

      const { name, sort, page, field } = query;
      //Check whether field query has any value that is not included in allowKey Array
      const fieldArr = !field ? [] : field.split("-");
      !fieldArr.every((field) => keyQuery.all.includes(field)) &&
        _throw(400, "Invalid value of field Query");

      // Find products that match the query object
      const products = await Products.find(
        { name: new RegExp(name, "i") },
        fieldArr.length !== 0 && fieldArr.join(" ")
      ).exec();

      // If no products are found, return a 204 status code
      if (!products || products.length === 0) return res.sendStatus(204);

      //Sort
      const sortedList = !sort ? products : mergeSort(products, sort);
      !sortedList && _throw(400, "Invalid value of sort Query");

      //Get product quantity based on page
      !Number(page) && page && _throw(400, "Invalid value page Query");
      const pageNum = !page
          ? Math.ceil(sortedList.length / limit)
          : Number(page),
        sliceList = !page
          ? sortedList
          : sortedList.slice((pageNum - 1) * limit, pageNum * limit);

      // Return the total number of products and the products themselves
      res.status(200).json({
        total: sliceList.length,
        page: pageNum,
        limit,
        list: sliceList,
      });
    } catch (err) {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error occurred while searching" });
    }
  },

  byField: async (req, res) => {
    try {
      const query = req.query,
        queryArr = Object.entries(query),
        keyArr = Object.keys(query);

      //Check whether req.query has any key-value pairs or not
      keyArr.length === 0 && _throw(400, "Query Params is required");

      //Check whether query has any key match allowKey array, if not send status 400
      !keyArr.every((val) => keyQuery.filter.includes(val)) &&
        _throw(400, "Invalid Query key");

      //Check whether have to filter by finding exact condition
      const matchObj = queryArr.reduce((obj, [key, value]) => {
        if (!keyQuery.uncompare.includes(key))
          return {
            ...obj,
            ...(value.includes("-")
              ? { $and: compareSymbol(value.split("-"), key) }
              : value.includes(".")
              ? { $or: compareSymbol(value.split("."), key) }
              : compareSymbol(value.split(), key)[0]),
          };
        else return obj;
      }, {});

      //Check whether have to filter field or not
      const fieldArr = !query.field ? [] : query.field.split("-");
      fieldArr.length > 0 &&
        !fieldArr.every((field) => keyQuery.all.includes(field)) &&
        _throw(400, "Invalid value of field Query");
      const fieldObj = fieldArr.reduce((obj, val) => {
        return { ...obj, [val]: 1 };
      }, {});

      //Set up filter aggregate pipe line
      const filterArr = [];
      filterArr.push({ $match: matchObj });
      Object.keys(fieldObj).length > 0 &&
        filterArr.push({ $project: fieldObj });
      req.query.random && filterArr.push({ $sample: { size: limit } });
      console.log(filterArr);

      // Find products that match the query object
      const products = await Products.aggregate(filterArr);

      //Sort
      const { sort, page } = query;
      const sortedList = !sort ? products : mergeSort(products, sort);
      !sortedList && _throw(400, "Invalid value sort Query");

      //Get product quantity based on page
      !Number(page) && page && _throw(400, "Invalid value page Params");
      const pageNum = !page
          ? Math.ceil(sortedList.length / limit)
          : Number(page),
        sliceList = !page
          ? sortedList
          : sortedList.slice((pageNum - 1) * limit, pageNum * limit);

      // Return 204 status code if no products are found
      if (!sliceList || sliceList.length === 0) return res.sendStatus(204);

      res.status(200).json({
        total: sliceList.length,
        page: pageNum,
        limit: Math.min(limit, sliceList.length),
        list: sliceList,
      });
    } catch (err) {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error occurred while filtering" });
    }
  },
};

export default getProductsByFilter;
