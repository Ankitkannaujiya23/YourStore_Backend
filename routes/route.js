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
import colorsController from "../controller/colorsController.js";
import sizesController from "../controller/sizesController.js";

const router = express.Router();
//users
router.post("/user/signup", signupValidation, userController.signup);
router.post("/user/login", loginValidation, userController.login);
router.post('/user/forgotPassword', userController.forgotPassword);
router.post('/user/updatePassword/:token', userController.updatePassword);

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
router.get('/category', jwtAuthentication, verifyAdminHandler, categoryController.getCategories);
router.post('/category', jwtAuthentication, verifyAdminHandler, categoryController.addCategory);
router.put('/category/:id', jwtAuthentication, verifyAdminHandler, categoryController.updateCategory);
router.get('/category/:id', jwtAuthentication, verifyAdminHandler, categoryController.getCategoryById);
router.delete('/category/:id', jwtAuthentication, verifyAdminHandler, categoryController.deleteCategory);

//colors
router.get('/colors', jwtAuthentication, verifyAdminHandler, colorsController.getAllColors);
router.post('/color', jwtAuthentication, verifyAdminHandler, colorsController.addColor);
router.put('/color/:id', jwtAuthentication, verifyAdminHandler, colorsController.updateColor);
router.get('/color/:id', jwtAuthentication, verifyAdminHandler, colorsController.getColorById);

//sizes
router.get('/sizes', jwtAuthentication, verifyAdminHandler, sizesController.getAllSizes);
router.post('/size', jwtAuthentication, verifyAdminHandler, sizesController.addSize);

export default router;
