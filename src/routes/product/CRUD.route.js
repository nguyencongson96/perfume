import express from "express";
const router = express.Router();
import productCRUD from "#root/controller/product/productCRUD.controller.js";
import verifyRoles from "#root/middleware/verifyRoles.middleware.js";
import verifyJWT from "#root/middleware/verifyJWT.middleware.js";
import ROLES_LIST from "#root/config/auth/rolesList.config.js";
import filterCheck from "#root/middleware/filter.middleware.js";

router
  .route("/")
  .get(filterCheck, productCRUD.getProductsByFilter)
  .post(verifyJWT, verifyRoles(ROLES_LIST.Admin), productCRUD.addProduct)
  .patch(verifyJWT, verifyRoles(ROLES_LIST.Admin), productCRUD.updateProduct);

//Route delete a product
router
  .route("/:id")
  .get(productCRUD.getAProduct)
  .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), productCRUD.deleteProduct);

export default router;
