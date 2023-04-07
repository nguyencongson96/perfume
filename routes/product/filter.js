import express from "express";
const router = express.Router();
import getProductsByFilter from "../../controller/product/filter.js";
import getDistinctList from "../../controller/product/distinct.js";

router.route("/").get(getProductsByFilter.byField);
router.route("/distinct/:field").get(getDistinctList);
router.route("/search").get(getProductsByFilter.bySearchName);

export default router;
