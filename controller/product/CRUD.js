import Products from "../../model/Products.js";
import mergeSort from "./sort.js";
import Pagination from "../../config/pagination.js";
import _throw from "../throw.js";

const productCRUD = {
  getAllProduct: async (req, res) => {
    try {
      const productsList = await Products.find();
      if (!productsList || productsList.length === 0) {
        return res.status(204).json({ msg: "No product found" });
      }
      const sortList = mergeSort(productsList, "nac");
      res.json({
        total: sortList.length,
        limit: Pagination.products_per_page,
        list: sortList,
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ msg: "An error occurred while retrieving products" });
    }
  },
  addProduct: async (req, res) => {
    try {
      const product = req.body;

      //Check if body is not object, in case it is an object, whether it is an array or not
      (typeof product !== "object" || Array.isArray(product)) &&
        _throw(400, "Invalid input body");

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
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error occurred while adding" });
    }
  },
  updateProduct: async (req, res) => {
    try {
      // Extract the id and the rest of the fields from the request body
      const { id, ...rest } = req.body;

      //Check if the rest is not object, in case it is an object, whether it is an array or not
      (typeof rest !== "object" || Array.isArray(rest)) &&
        _throw(400, "Invalid input body");

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
        if (
          (typeof rest[key] === "object" &&
            Object.keys(rest[key]).length > 0) ||
          (typeof rest[key] !== "object" && rest[key].length > 0)
        )
          foundProduct[key] = rest[key];
      });

      // Save the updated product to the database
      await foundProduct.save();

      // Return the updated product with a status of 200
      res.status(200).json(foundProduct);
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error occurred while updating" });
    }
  },
  deleteProduct: async (req, res) => {
    try {
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
    } catch (err) {
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error occurred while deleting" });
    }
  },
  getAProduct: async (req, res) => {
    try {
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
    } catch (err) {
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error occurred while getting" });
    }
  },
  test: async (req, res) => {
    const list = req.body;
    for (const item of list) {
      const { _id, type } = item;
      const foundProduct = await Products.findById(_id);
      foundProduct.type = type;
      await foundProduct.save();
    }
  },
};

export default productCRUD;
