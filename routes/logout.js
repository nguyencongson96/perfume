import express from "express";
const route = express.Router();
import handleLogOut from "../controller/token/logout.js";

route.route("/").post(handleLogOut);

export default route;
