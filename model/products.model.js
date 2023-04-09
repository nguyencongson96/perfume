import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, require: true },
  brand: { type: String, require: true },
  image: { type: Array, require: true },
  aroma: { type: Array, require: true },
  type: { type: Array, require: true },
  capacity: { type: Array, of: Number, require: true },
  price: { type: Array, of: Number, require: true },
  stock: { type: Array, of: Number, require: true },
  description: { type: String, require: true },
});

const productModel = mongoose.model("Products", ProductSchema);

export default productModel;
