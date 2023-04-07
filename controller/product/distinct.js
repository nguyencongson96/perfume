import Products from "../../model/Products.js";
import keyQuery from "../../config/filter/keyQuery.js";
import _throw from "../throw.js";

const distinctKey = keyQuery.distinct;

// Define an asynchronous function named getDistinctList that accepts two parameters, req and res
const getDistinctList = async (req, res) => {
  try {
    const { field } = req.params;

    // If the "field" parameter does not exist, throw an error with status code 400 and message "Param is required"
    !field && _throw(400, "Param is required");

    // If the "field" parameter exists but is not a string or contains invalid elements, throw an error with status code 400 and message "Invalid Param"
    typeof field !== "string" && _throw(400, "Invalid Param");

    // Loop through each element of the "fieldArr" array and set a property in the "result" object with the same name as the element and assign to it an array of distinct values of that field obtained from a MongoDB query using the Mongoose model named "Products"
    const result = {};
    for (const item of field.split("-")) {
      !distinctKey.includes(item) && _throw(400, "Invalid Param");
      result[item] = await Products.distinct(item);
    }

    // Send a JSON response with status code 200 containing the "result" object
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res
      .status(err.status || 500)
      .json({ msg: err.msg || "Error occurred while distincting" });
  }
};

export default getDistinctList;
