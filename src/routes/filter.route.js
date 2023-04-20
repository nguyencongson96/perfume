import express from "express";
const router = express.Router();
import getProductsByFilter from "#root/controller/product/productFilter.controller.js";

//Route filter
router.route("/").get(getProductsByFilter);

export default router;
