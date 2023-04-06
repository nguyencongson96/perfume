import express from "express";
const router = express.Router();
import registerController from "../controller/token/register.js";

router.route("/").post(registerController.handleNewUser);

export default router;
