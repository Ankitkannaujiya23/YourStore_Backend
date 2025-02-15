import express from "express";
import userController from "../controller/userController.js";
import {
  loginValidation,
  signupValidation,
} from "../validationSchema/userValidationSchema.js";
const router = express.Router();

router.post("/user/signup", signupValidation, userController.signup);
router.post("/user/login", loginValidation, userController.login);

export default router;
