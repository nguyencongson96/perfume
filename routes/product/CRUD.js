import express from "express";
const router = express.Router();
import productCRUD from "../../controller/product/CRUD.js";
import ROLES_LIST from "../../config/rolesList.js";
import verifyRoles from "../../middleware/verifyRoles.js";
import verifyJWT from "../../middleware/verifyJWT.js";

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

//Need accessToken to do the next route
router.use(verifyJWT, verifyRoles(ROLES_LIST.Admin));

//Route get detail of all products, add a new product, update a product
router
  .route("/")
  .get(getAllProduct)
  .post(addProduct)
  .patch(updateProduct)
  .put(test);

//Route delete a product
router.route("/:id").delete(deleteProduct);

export default router;
