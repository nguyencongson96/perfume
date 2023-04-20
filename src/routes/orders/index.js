import express from "express";
const router = express.Router();
import adminRoute from "#root/routes/orders/adminOrder.route.js";
import userRoute from "#root/routes/orders/userOrder.route.js";

//Route get an array of unique items of a field
router.use("/admin", adminRoute);
router.use("/user", userRoute);

export default router;
