import Products from "../../model/products.model.js";
import keyQuery from "../../config/filter/filterKey.config.js";
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

    // Send all promise at once to get the distinct item and get return as array of array
    const fieldArr = field.split("-"),
      uniqueArr = await Promise.all(
        fieldArr.map((item) => {
          !distinctKey.includes(item) && _throw(400, "Invalid Param");
          return Products.distinct(item);
        })
      );

    //Convert array of array to obj of array
    const result = uniqueArr.reduce((obj, unique, index) => {
      const newField = { [fieldArr[index]]: unique };
      return { ...obj, ...newField };
    }, {});

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
