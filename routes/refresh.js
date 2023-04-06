import express from "express";
const route = express.Router();
import handleRefreshToken from "../controller/token/refreshToken.js";

route.route("/").post(handleRefreshToken);

export default route;
