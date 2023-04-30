import express from "express";
const router = express.Router();
import getProductsByFilter from "#root/controller/product/productFilter.controller.js";
import filterCheck from "#root/middleware/filter.middleware.js";

//Route filter
router.route("/").get(filterCheck, getProductsByFilter);

export default router;
