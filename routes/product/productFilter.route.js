import express from "express";
const router = express.Router();
import getProductsByFilter from "../../controller/product/productFilter.controller.js";
import getDistinctList from "../../controller/product/distinct.js";

//Route filter
router.route("/").get(getProductsByFilter.byField);

//Route search
router.route("/search").get(getProductsByFilter.bySearchName);

//Route get an array of unique items of a field
router.route("/distinct/:field").get(getDistinctList);

export default router;
