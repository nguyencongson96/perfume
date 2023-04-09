import mongoose from "mongoose";
import validator from "validator";
import _throw from "../controller/throw.js";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: mongoose.ObjectId, require: true },
  name: String,
  phone: {
    type: String,
    validate: (val) => {
      !validator.isNumeric(val) && _throw(400, "Invalid phone number");
    },
  },
  address: String,
  status: {
    type: String,
    require: true,
  },
  total: {
    type: Number,
    default: 0,
    validate: (val) => {
      val < 0 && _throw(400, "Invalid total");
    },
  },
  cart: {
    type: [
      {
        productId: { type: mongoose.ObjectId, require: true },
        quantity: {
          type: Number,
          default: 0,
          require: true,
          validate: (val) => {
            val < 0 && _throw(400, "Invalid quantity");
          },
        },

        capacity: {
          type: Number,
          require: true,
          default: 0,
          validate: (val) => {
            (!validator.isInt(val.toString()) || val < 0) &&
              _throw(400, "Invalid capacity");
          },
        },

        price: {
          type: Number,
          require: true,
          default: 0,
          validate: (val) => {
            (!validator.isInt(val.toString()) || val < 0) &&
              _throw(400, "Invalid price");
          },
        },
      },
    ],
    require: true,
  },
});

const orderModel = mongoose.model("Orders", orderSchema);

export default orderModel;
