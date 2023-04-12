import Products from "../../model/products.model.js";
import Pagination from "../../config/product/pagination.config.js";
import keyQuery from "../../config/product/keyQuery.config.js";
import asyncWrapper from "../../middleware/async.middleware.js";
import _throw from "../throw.js";
import isObj from "../checkObj.js";

const { limit } = Pagination;

const productCRUD = {
  getAllProduct: asyncWrapper(async (req, res) => {
    const productsList = await Products.find({}, keyQuery.getList.join(" "));
    if (!productsList || productsList.length === 0) {
      return res.status(204).json({ msg: "No product found" });
    }
    res.json({
      total: productsList.length,
      limit: limit,
      list: productsList,
    });
  }),
  addProduct: asyncWrapper(async (req, res) => {
    const product = req.body;

    //Check if body is not object, in case it is an object, whether it is an array or not
    isObj(product) && _throw(400, "Invalid input body");

    // Check if all fields are required
    Object.values(product).every((ele) => {
      (typeof ele === "object"
        ? Object.keys(ele).length === 0
        : ele.toString().length === 0) &&
        _throw(400, "All fields are required");
    });

    // Create a new product using the create() method of the Products object
    const newProduct = await Products.create(product);

    // Return the newly created product with a status of 201
    res.status(201).json(newProduct);
  }),
  updateProduct: asyncWrapper(async (req, res) => {
    // Extract the id and the rest of the fields from the request body
    const { id, ...rest } = req.body;

    //Check if the rest is not object, in case it is an object, whether it is an array or not
    isObj(rest) && _throw(400, "Invalid input body");

    // Check if id is present in the request body
    !id && _throw(400, "ID is required");

    // Find the product with the given id
    const foundProduct = await Products.findById(id);

    // If no product is found with the given id, return a 204 status code
    if (!foundProduct)
      return res
        .status(204)
        .json({ msg: `There is no product match ID ${id}` });

    // Update the fields of the found product with the fields from the request body
    Object.keys(rest).forEach((key) => {
      const value = rest[key];
      isObj(value)
        ? Object.keys(value).length > 0 && (foundProduct[key] = value)
        : value.length > 0 && (foundProduct[key] = value);
    });

    // Save the updated product to the database
    await foundProduct.save();

    // Return the updated product with a status of 200
    res.status(200).json(foundProduct);
  }),
  deleteProduct: asyncWrapper(async (req, res) => {
    // Extract the id from the request parameters
    const { id } = req.params;

    // Check if id is present in the request parameters
    !id && _throw(400, "ID Parameter is required");

    // Find and delete the product with the given id
    const deleteProduct = await Products.findByIdAndDelete(id);

    // If no product is found with the given id, return a 204 status code
    !deleteProduct
      ? res.status(204).json({ msg: `There is no product match ID ${id}` })
      : res.status(200).json({ msg: `Product ID ${id} has been deleted` }); // Return a success message with a status of 200
  }),
  getAProduct: asyncWrapper(async (req, res) => {
    // Extract the id from the request parameters
    const { id } = req.params;

    // Check if id is present in the request parameters
    !id && _throw(400, "ID Parameter is required");

    // Find the product with the given id
    const foundProduct = await Products.findById(id);

    // If no product is found with the given id, return a 204 status code
    !foundProduct
      ? res.status(204).json({ msg: `There is no product matched ID ${id}` })
      : res.status(200).json(foundProduct); // Return the found product with a status of 200
  }),
  test: async (req, res) => {
    try {
      const result = [];
      const productsList = await Products.find();
      for (const product of productsList) {
        const newAroma = product.aroma.map((str) => {
          str = str.toLowerCase().split(" ");
          for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
          }
          return str.join(" ");
        });
        product.aroma = newAroma;
        await product.save();
        result.push(newAroma);
      }
      return res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
};

export default productCRUD;
