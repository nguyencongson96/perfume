import express from "express";
const router = express.Router();
import handleOrderByAdmin from "#root/controller/order/adminOrder.controller.js";
import verifyJWT from "#root/middleware/verifyJWT.middleware.js";
import verifyRoles from "#root/middleware/verifyRoles.middleware.js";
import ROLES_LIST from "#root/config/auth/rolesList.config.js";

router.use(verifyJWT, verifyRoles(ROLES_LIST.Admin));

//Route get infor of one order and route update infor of one order
router.route("/:id").get(handleOrderByAdmin.getOneOrder).put(handleOrderByAdmin.updateOrder);

//Route get all order from all users
router.route("/").get(handleOrderByAdmin.filterOrders);

export default router;
