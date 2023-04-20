import express from "express";
const router = express.Router();
import getDistinctList from "#root/controller/product/distinct.controller.js";

//Route get an array of unique items of a field
router.route("/:field").get(getDistinctList);

export default router;
