import mongoose from "mongoose";
const Schema = mongoose.Schema;
import validator from "validator";
import _throw from "../controller/throw.js";

const ProductSchema = new Schema({
  name: {
    type: String,
    require: [true, "Name Required"],
    validate: (value) => {
      !validator.isAlphanumeric(value.replaceAll(" ", "")) &&
        _throw(400, "Invalid Name");
    },
  },
  brand: {
    type: String,
    require: [true, "Brand Required"],
    validate: (value) => {
      !validator.isAlphanumeric(value.replaceAll(" ", "")) &&
        _throw(400, "Invalid Brand");
    },
  },
  image: { type: [String], require: [true, "Image Required"] },
  aroma: {
    type: [String],
    require: [true, "Aroma Required"],
  },
  type: {
    type: [String],
    require: [true, "Type Required"],
  },
  capacity: {
    type: [Number],
    require: [true, "Capacity Required"],
  },
  price: {
    type: [Number],
    require: [true, "Price Required"],
  },
  stock: {
    type: [Number],
    require: [true, "Stock Required"],
  },
  description: {
    type: String,
    require: [true, "Description Required"],
  },
  createdAt: Date,
  lastUpdateAt: Date,
});

const productModel = mongoose.model("Products", ProductSchema);

export default productModel;
