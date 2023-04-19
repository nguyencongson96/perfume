import express from "express";
import CRUD from "./CRUD.route.js";
import distinctRoute from "./distinct.route.js";
const router = express.Router();

router.use("/distinct", distinctRoute);
router.use("/", CRUD);

export default router;
