import express from "express";
const route = express.Router();
import handleRefreshToken from "#root/controller/token/refreshToken.controller.js";

route.route("/").post(handleRefreshToken);

export default route;
