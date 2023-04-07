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

router.route("/").get(getAllProduct).put(test);
router.route("/:id").get(getAProduct);

router.use(verifyJWT, verifyRoles(ROLES_LIST.Admin));
router.route("/").post(addProduct).patch(updateProduct);
router.route("/:id").delete(deleteProduct);

export default router;
