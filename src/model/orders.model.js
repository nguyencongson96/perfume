import mongoose from "mongoose";
import validator from "validator";
import _throw from "#root/utils/throw.js";
import orderStatus from "#root/config/status.config.js";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: mongoose.ObjectId, require: true },
  name: { type: String, require: [true, "Name required"] },
  phone: {
    type: String,
    require: [true, "Phone required"],
    validate: (val) => {
      !validator.isMobilePhone(val, "vi-VN") && _throw(400, "Invalid phone number");
    },
  },
  address: { type: String, require: [true, "Address required"] },
  status: {
    type: String,
    require: [true, "Status required"],
    validate: (val) => {
      !orderStatus.all.includes(val) && _throw(400, "Invalid status");
    },
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
            (!validator.isInt(val.toString()) || val < 0) && _throw(400, "Invalid capacity");
          },
        },

        price: {
          type: Number,
          require: true,
          default: 0,
          validate: (val) => {
            (!validator.isInt(val.toString()) || val < 0) && _throw(400, "Invalid price");
          },
        },
      },
    ],
    require: true,
  },
  createdAt: Date,
  lastUpdateAt: Date,
  submitAt: Date,
});

const orderModel = mongoose.model("Orders", orderSchema);

export default orderModel;
