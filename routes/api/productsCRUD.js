import express from "express";
const router = express.Router();
import productCRUD from "../../controller/product/CRUD.js";
import ROLES_LIST from "../../config/rolesList.js";
import verifyRoles from "../../middleware/verifyRoles.js";
import verifyJWT from "../../middleware/verifyJWT.js";
import verifyUser from "../../middleware/verifyUser.js";

router.route("/").get(productCRUD.getAllProduct).put(productCRUD.test);
router.route("/:id").get(productCRUD.getAProduct);

router.use(verifyJWT, verifyUser, verifyRoles(ROLES_LIST.Admin));
router.route("/").post(productCRUD.addProduct).patch(productCRUD.updateProduct);
router.route("/:id").delete(productCRUD.deleteProduct);

export default router;
