import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: mongoose.ObjectId, require: true },
  name: { type: String },
  phone: { type: String, require: false },
  address: { type: String },
  status: { type: String, require: true },
  total: { type: Number, require: true },
  cart: {
    type: Array,
    of: {
      productId: { type: String, require: true },
      quantity: { type: Number, require: true, min: 1 },
      capacity: { type: Number, require: true },
      price: { type: Number, required: true },
    },
    require: true,
  },
});

const orderModel = mongoose.model("Orders", orderSchema);

export default orderModel;
