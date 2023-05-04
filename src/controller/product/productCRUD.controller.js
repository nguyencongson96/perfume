import Products from "#root/model/products.model.js";
import keyQuery from "#root/config/product/keyQuery.config.js";
import asyncWrapper from "#root/middleware/async.middleware.js";
import _throw from "#root/utils/throw.js";
import currentTime from "#root/utils/currentTime.js";
import mongoose from "mongoose";

const productCRUD = {
  getAllProduct: asyncWrapper(async (req, res) => {
    const productsList = await Products.find({}, keyQuery.getList.join(" "));
    if (!productsList || productsList.length === 0) {
      return res.status(204).json({ msg: "No product found" });
    }

    return res.json({
      total: productsList.length,
      list: productsList,
    });
  }),
  addProduct: asyncWrapper(async (req, res) => {
    const product = req.body,
      time = currentTime();

    // Create a new product using the create() method of the Products object
    const newProduct = await Products.create({
      ...product,
      createdAt: time,
      lastUpdateAt: time,
    });

    // Return the newly created product with a status of 201
    return res.status(201).json(newProduct);
  }),
  updateProduct: asyncWrapper(async (req, res) => {
    // Extract the id and the rest of the fields from the request body
    const { id } = req.body,
      time = currentTime();

    // Check if id is present in the request body
    !id && _throw(400, "ID is required");

    // Find the product with the given id
    const foundProduct = await Products.findByIdAndUpdate(
      id,
      { ...req.body, lastUpdateAt: time },
      { runValidators: true, new: true }
    );

    // If no product is found with the given id, return a 204 status code
    if (!foundProduct) return res.status(204).json(`There is no product match ID ${id}`);

    // Return the updated product with a status of 200
    return res.status(200).json(foundProduct);
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
      ? res.status(204).json(`There is no product match ID ${id}`)
      : res.status(200).json(`Product ID ${id} has been deleted`); // Return a success message with a status of 200
  }),
  getAProduct: asyncWrapper(async (req, res) => {
    // Extract the id from the request parameters
    const { id } = req.params;

    // Check if id is present in the request parameters
    !id && _throw(400, "ID Parameter is required");

    // Find the product with the given id
    const foundProduct = await Products.findById(id);

    // If no product is found with the given id, return a 204 status code
    !foundProduct ? _throw(404, `There is no product matched ID ${id}`) : res.status(200).json(foundProduct); // Return the found product with a status of 200
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
