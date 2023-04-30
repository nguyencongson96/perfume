import mongoose from "mongoose";

const dbConnect = async (req, res, next) => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.DATABASE_URI);
  next();
};

export default dbConnect;
