import express from "express";
const router = express.Router();
import handleOrderByUser from "../../controller/order/userOrder.controller.js";
import verifyJWT from "../../middleware/verifyJWT.middleware.js";
import verifyRoles from "../../middleware/verifyRoles.middleware.js";
import ROLES_LIST from "../../config/rolesList.config.js";

router.route("/").post(handleOrderByUser.addNewOrder);

router.use(verifyJWT, verifyRoles(ROLES_LIST.User));
router.route("/pending").get(handleOrderByUser.getPendingOrder);
router.route("/:id").get(handleOrderByUser.getOneOrder);
router
  .route("/")
  .get(handleOrderByUser.getOrders)
  .put(handleOrderByUser.updateOrder)
  .delete(handleOrderByUser.deleteOrder);

export default router;
