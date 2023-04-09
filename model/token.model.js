import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  userId: { type: mongoose.ObjectId, require: true },
  accessToken: { type: String },
  refreshToken: { type: String },
});

const tokenModel = mongoose.model("Token", TokenSchema);

export default tokenModel;
