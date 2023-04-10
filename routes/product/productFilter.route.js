import express from "express";
const router = express.Router();
import getProductsByFilter from "../../controller/product/productFilter.controller.js";

//Route filter
router.route("/").get(getProductsByFilter);

export default router;
