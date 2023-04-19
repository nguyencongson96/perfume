import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  userId: { type: mongoose.ObjectId, require: [true, "userId required"] },
  accessToken: { type: String },
  refreshToken: { type: String },
});

const tokenModel = mongoose.model("Token", TokenSchema);

export default tokenModel;
