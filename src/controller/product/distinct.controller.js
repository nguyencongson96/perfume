import Products from "#root/model/products.model.js";
import keyQuery from "#root/config/keyQuery.config.js";
import _throw from "#root/utils/throw.js";
import asyncWrapper from "#root/middleware/async.middleware.js";

const distinctKey = keyQuery.product.distinct;

// Define an asynchronous function named getDistinctList that accepts two parameters, req and res
const getDistinctList = asyncWrapper(async (req, res) => {
  const { field } = req.params;

  // If the "field" parameter does not exist, throw an error with status code 400 and message "Param is required"
  !field && _throw(400, "Param is required");

  // Send all promise at once to get the distinct item and get return as array of array
  const fieldArr = field.split("-"),
    uniqueArr = await Promise.all(
      fieldArr.map((item) => {
        !distinctKey.includes(item) && _throw(400, "Invalid Param");
        return Products.distinct(item);
      })
    );

  //Convert array of array to obj of array
  const result = uniqueArr.reduce((obj, list, index) => {
    const field = fieldArr[index];
    return { ...obj, ...{ [field]: list } };
  }, {});

  // Send a JSON response with status code 200 containing the "result" object
  return res.status(200).json(result);
});

export default getDistinctList;
