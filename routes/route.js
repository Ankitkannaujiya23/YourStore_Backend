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
import cartController from "../controller/cartController.js";
import addressController from "../controller/addressController.js";
import addressValidation from "../validationSchema/addressValidation.js";
import orderController from "../controller/orderController.js";

const router = express.Router();
//users
router.post("/user/signup", signupValidation, userController.signup);
router.post("/user/login", loginValidation, userController.login);
router.post('/user/forgotPassword', userController.forgotPassword);
router.post('/user/updatePassword/:token', userController.updatePassword);
router.get('/user/getuserdetail', jwtAuthentication, userController.getUserDetail);
router.post('/user/updateuser', jwtAuthentication, userController.updateUserDetail);

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
router.get('/size/:id', jwtAuthentication, verifyAdminHandler, sizesController.getSizeById);
router.post('/size', jwtAuthentication, verifyAdminHandler, sizesController.addSize);
router.put('/size/:id', jwtAuthentication, verifyAdminHandler, sizesController.updateSize);

//cart
router.post('/cart/add', jwtAuthentication, cartController.addToCart);
router.put('/cart/update', jwtAuthentication, cartController.updateCart);
router.post('/cart/sync', jwtAuthentication, cartController.syncCart);
router.delete('/cart/remove', jwtAuthentication, cartController.removeFromCart);
router.get('/cart/fetchcart', jwtAuthentication, cartController.fetchCart);

//address
router.post('/address/add', addressValidation, jwtAuthentication, addressController.addAddress);
router.put('/address/update', jwtAuthentication, addressController.updateAddress);
router.delete('/address/:id', jwtAuthentication, addressController.deleteAddress);
router.get('/address/getaddresslist', jwtAuthentication, addressController.getAddress);

//order
router.post('/order/create', jwtAuthentication, orderController.createOrder);
router.post('/orders/getorders', jwtAuthentication, orderController.getOrders);

export default router;
