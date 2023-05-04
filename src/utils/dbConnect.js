import mongoose from "mongoose";
import _throw from "#root/utils/throw.js";
import asyncWrapper from "#root/middleware/async.middleware.js";

const dbConnect = asyncWrapper(async (req, res) => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.DATABASE_URI);
});

export default dbConnect;
