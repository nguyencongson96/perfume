import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { corsOptions } from "#root/config/corsOptions.config.js";
import auth from "#root/routes/auth/auth.route.js";
import productIndex from "#root/routes/product/index.js";
import orderIndex from "#root/routes/orders/index.js";
import refresh from "#root/routes/auth/refresh.route.js";
import dbConnect from "#root/utils/dbConnect.js";
import errHandler from "#root/middleware/errHandler.middleware.js";
import credentials from "#root/middleware/credentials.middleware.js";
const PORT = process.env.PORT || 4000;

//Connect to mongoDB
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
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/", express.static(path.join(__dirname, "public")));

//Routes
app.use("/auth", auth);
app.use("/refresh", refresh);
app.use("/products", productIndex);
app.use("/order", orderIndex);

//Handle Errors
app.use(errHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
