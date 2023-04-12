import express from "express";
const router = express.Router();
import handleOrderByUser from "../../controller/order/userOrder.controller.js";
import verifyJWT from "../../middleware/verifyJWT.middleware.js";
import verifyRoles from "../../middleware/verifyRoles.middleware.js";
import ROLES_LIST from "../../config/rolesList.config.js";

//Route add new order could be processed by any user even not login
router.route("/").post(handleOrderByUser.addNewOrder);

router.use(verifyJWT, verifyRoles(ROLES_LIST.User));

//Route get pending order of user logged in
router.route("/pending").get(handleOrderByUser.getPendingOrder);

//Route get one order of user logged in
router.route("/:id").get(handleOrderByUser.getOneOrder);

//Route get all orders, update one order and delete pending order of user logged in
router
  .route("/")
  .get(handleOrderByUser.getOrders)
  .put(handleOrderByUser.updateOrder)
  .delete(handleOrderByUser.deleteOrder);

export default router;
