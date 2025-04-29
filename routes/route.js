import express from "express";
import userController from "../controller/userController.js";
import {
  loginValidation,
  signupValidation,
} from "../validationSchema/userValidationSchema.js";
import productController from "../controller/productController.js";
import jwtAuthentication from "../middleware/jwtAuthentication.js";
import verifyAdminHandler from "../middleware/verifyAdminHandler.js";
import { uploadImageHandler } from "../middleware/uploadImageHandler.js";
import categoryController from "../controller/categoryController.js";
const router = express.Router();
//users
router.post("/user/signup", signupValidation, userController.signup);
router.post("/user/login", loginValidation, userController.login);

//products
router.get("/products", productController.getAllProducts);
router.get("/product/:id", productController.getProductById);
//protected routes for admin access
router.delete(
  "/product/:id",
  jwtAuthentication,
  verifyAdminHandler,
  productController.deleteProduct
);
router.post(
  "/product",
  jwtAuthentication,
  verifyAdminHandler,
  uploadImageHandler,
  productController.addProduct
);
router.put(
  "/product/:id",
  jwtAuthentication,
  verifyAdminHandler,
  productController.updateProduct
);

//category 
router.get('/category', jwtAuthentication,verifyAdminHandler, categoryController.getCategories);
router.post('/category', jwtAuthentication,verifyAdminHandler, categoryController.addCategory);
router.put('/category/:id', jwtAuthentication, verifyAdminHandler, categoryController.updateCategory);

export default router;
