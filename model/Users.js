import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, require: true },
  email: { type: String, require: true },
  phone: { type: String, require: true },
  password: { type: String, require: true },
  roles: {
    User: { type: Number, default: 0 },
    Admin: { type: Number },
  },
  refreshToken: { type: String },
});

const userModel = mongoose.model("Users", userSchema);

export default userModel;
