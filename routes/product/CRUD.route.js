import express from "express";
const router = express.Router();
import productCRUD from "../../controller/product/productCRUD.controller.js";
import verifyRoles from "../../middleware/verifyRoles.middleware.js";
import verifyJWT from "../../middleware/verifyJWT.middleware.js";
import ROLES_LIST from "../../config/auth/rolesList.config.js";

//Route get detail infor of a product
router.route("/:id").get(productCRUD.getAProduct);
router.route("/").get(productCRUD.getAllProduct).put(productCRUD.test);

//Need accessToken to do the next route
router.use(verifyJWT, verifyRoles(ROLES_LIST.Admin));

//Route get detail of all products, add a new product, update a product
router.route("/").post(productCRUD.addProduct).patch(productCRUD.updateProduct);

//Route delete a product
router.route("/:id").delete(productCRUD.deleteProduct);

export default router;
