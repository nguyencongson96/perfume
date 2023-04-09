import express from "express";
const router = express.Router();
import productCRUD from "../../controller/product/productCRUD.controller.js";
import ROLES_LIST from "../../config/rolesList.config.js";
import verifyRoles from "../../middleware/verifyRoles.middleware.js";
import verifyJWT from "../../middleware/verifyJWT.middleware.js";
import getDistinctList from "../../controller/product/distinct.js";

const {
  getAllProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getAProduct,
  test,
} = productCRUD;

//Route get detail infor of a product
router.route("/:id").get(getAProduct);
router.route("/").get(getAllProduct);

//Route get an array of unique items of a field
router.route("/distinct/:field").get(getDistinctList);

//Need accessToken to do the next route
router.use(verifyJWT, verifyRoles(ROLES_LIST.Admin));

//Route get detail of all products, add a new product, update a product
router.route("/").post(addProduct).patch(updateProduct).put(test);

//Route delete a product
router.route("/:id").delete(deleteProduct);

export default router;
