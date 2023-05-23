import express from "express";
const route = express.Router();
import handleRefreshToken from "#root/controller/auth/refreshToken.controller.js";

route.route("/").post(handleRefreshToken);

export default route;
