import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dbConnect from "./config/dbConnect.js";
import auth from "./routes/auth.js";
import productCRUD from "./routes/product/CRUD.js";
import productsFilter from "./routes/product/filter.js";
import orderAdmin from "./routes/orders/admin.js";
import orderUser from "./routes/orders/user.js";
import refresh from "./routes/refresh.js";
import { logger } from "./middleware/logEvents.js";
import errHandler from "./middleware/errHandler.js";
import credentials from "./middleware/credentials.js";
import { corsOptions } from "./config/corsOptions.js";
const PORT = process.env.PORT || 4000;

//Connect to MongoDB
dbConnect();

//Custom middleware logger
app.use(logger);

//Handle options credentials check  - before CORS and fetch cookies credentials requirement
app.use(credentials);

//build-in middleware to handle urlencoded data
app.use(express.urlencoded({ extended: true }));

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//build-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

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
app.use("/edit", productCRUD);
app.use("/products", productsFilter);
app.use("/order/admin", orderAdmin);
app.use("/order/user", orderUser);

//Handle Errors
app.use(errHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
