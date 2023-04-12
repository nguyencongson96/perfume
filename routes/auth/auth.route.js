import express from "express";
import authController from "../../controller/token/auth.controller.js";
import verifyJWT from "../../middleware/verifyJWT.middleware.js";
const router = express.Router();

router
  .post("/login", authController.logIn)
  .post("/register", authController.register);
router
  .use(verifyJWT)
  .put("/update", authController.update)
  .post("/logout", authController.logOut);
export default router;
