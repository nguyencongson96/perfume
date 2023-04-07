import express from "express";
const router = express.Router();
import handleOrderByUser from "../../controller/order/user.js";
import verifyUser from "../../middleware/verifyUser.js";

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
