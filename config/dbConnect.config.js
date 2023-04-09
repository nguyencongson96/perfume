import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.log(err);
  }
};

export default dbConnect;
