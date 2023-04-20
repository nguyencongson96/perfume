import express from "express";
import CRUD from "#root/routes/product/CRUD.route.js";
import distinctRoute from "#root/routes/product/distinct.route.js";
const router = express.Router();

router.use("/distinct", distinctRoute);
router.use("/", CRUD);

export default router;
