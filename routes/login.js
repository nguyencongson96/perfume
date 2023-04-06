import express from "express";
import authController from "../controller/token/auth.js";
const router = express.Router();

router.post("/", authController.handleLogin);

export default router;
