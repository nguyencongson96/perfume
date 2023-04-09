import express from "express";
const router = express.Router();
import getProductsByFilter from "../../controller/product/productFilter.controller.js";

//Route filter
router.route("/").get(getProductsByFilter.byField);

//Route search
router.route("/search").get(getProductsByFilter.bySearchName);

export default router;
