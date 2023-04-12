import express from "express";
const router = express.Router();
import handleOrderByAdmin from "../../controller/order/adminOrder.controller.js";
import verifyJWT from "../../middleware/verifyJWT.middleware.js";
import verifyRoles from "../../middleware/verifyRoles.middleware.js";
import ROLES_LIST from "../../config/rolesList.config.js";

router.use(verifyJWT, verifyRoles(ROLES_LIST.Admin));

//Route get all order from all users
router.route("/").get(handleOrderByAdmin.getOrders);

//Route get infor of one order and route update infor of one order
router
  .route("/:id")
  .get(handleOrderByAdmin.getOneOrder)
  .put(handleOrderByAdmin.updateOrder);

export default router;
