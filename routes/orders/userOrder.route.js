import express from "express";
const router = express.Router();
import handleOrderByUser from "../../controller/order/userOrder.controller.js";
import verifyUser from "../../middleware/verifyUser.middleware.js";

router.use(verifyUser);
router
  .route("/")
  .get(handleOrderByUser.getOrders)
  .post(handleOrderByUser.addNewOrder)
  .put(handleOrderByUser.updateOrder)
  .delete(handleOrderByUser.deleteOrder);

router.route("/pending").get(handleOrderByUser.getPendingOrder);
router.route("/:id").get(handleOrderByUser.getOneOrder);

export default router;
