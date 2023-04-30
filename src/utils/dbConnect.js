import mongoose from "mongoose";

const dbConnect = async (req, res) => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.log(err);
    res.status(500).json("Fail to connect to MongoDB");
  }
};

export default dbConnect;
