import mongoose from "mongoose";
import validator from "validator";
import _throw from "#root/utils/throw.js";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    require: [true, "require username"],
    validate: (val) => {
      val.length <= 3 && _throw(400, "username too short");
    },
  },
  email: {
    type: String,
    require: [true, "require email"],
    validate: (val) => {
      !validator.isEmail(val) && _throw(400, "invalid email");
    },
  },
  phone: {
    type: String,
    require: [true, "require phone"],
    validate: (val) => {
      !validator.isMobilePhone(val, "vi-VN") && _throw(400, "invalid phone");
    },
  },
  password: {
    type: String,
    require: [true, "require password"],
    validate: (val) => {
      val.length <= 8 && _throw(400, "password too short");
      !validator.isStrongPassword(val) && _throw(400, "password is weak");
    },
  },
  roles: {
    User: { type: Number, default: 0 },
    Admin: { type: Number },
  },
  createAt: Date,
  lastActiveAt: Date,
  lastUpdateAt: Date,
});

const userModel = mongoose.model("Users", userSchema);

export default userModel;
