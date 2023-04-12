import mongoose from "mongoose";
import validator from "validator";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    validate: (val) => {
      if (validator.isEmpty(val)) throw new Error("require username");
      else if (val.length <= 3) throw new Error("username too short");
    },
  },
  email: {
    type: String,
    require: true,
    validate: (val) => {
      if (validator.isEmpty(val)) throw new Error("require email");
      else if (!validator.isEmail(val)) throw new Error("invalid email");
    },
  },
  phone: {
    type: String,
    require: true,
    validate: (val) => {
      if (validator.isEmpty(val)) throw new Error("require phone number");
      else if (val.length <= 9) throw new Error("invalid phone");
    },
  },
  password: {
    type: String,
    require: true,
    validate: (val) => {
      if (validator.isEmpty(val)) throw new Error("require password");
      else if (val.length <= 8) throw new Error("password too short");
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
