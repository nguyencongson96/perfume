import express from "express";
import authController from "../controller/token/auth.js";
const router = express.Router();

router
  .post("/login", authController.logIn)
  .post("/logout", authController.logOut)
  .post("/register", authController.register);

export default router;
