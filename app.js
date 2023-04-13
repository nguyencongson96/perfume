import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dbConnect from "./config/dbConnect.config.js";
import { corsOptions } from "./config/corsOptions.config.js";
import auth from "./routes/auth/auth.route.js";
import productCRUD from "./routes/product/productCRUD.route.js";
import productsFilter from "./routes/product/productFilter.route.js";
import distinct from "./routes/product/distinct.route.js";
import adminOrder from "./routes/orders/adminOrder.route.js";
import userOrder from "./routes/orders/userOrder.route.js";
import refresh from "./routes/auth/refresh.route.js";
import errHandler from "./middleware/errHandler.middleware.js";
import credentials from "./middleware/credentials.middleware.js";
const PORT = process.env.PORT || 4000;

//Connect to MongoDB
dbConnect();

//Handle options credentials check  - before CORS and fetch cookies credentials requirement
app.use(credentials);

//build-in middleware to handle urlencoded data
app.use(express.urlencoded({ extended: true }));

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//build-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

//build-in middleware for static files
app.use(
  "/",
  express.static(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "public")
  )
);

//Routes
app.use("/auth", auth);
app.use("/refresh", refresh);
app.use("/products", productCRUD);
app.use("/distinct", distinct);
app.use("/filter", productsFilter);
app.use("/order/admin", adminOrder);
app.use("/order/user", userOrder);

//Handle Errors
app.use(errHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
