import { body } from "express-validator";

export const signupValidation = [
  body("email").isEmail().withMessage("Enter valid email"),
  body("name").isLength({ min: 1 }).withMessage("Enter name"),
  body("password").isLength({ min: 1 }).withMessage("Enter password"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Enter a valid email."),
  body("password").isLength({ min: 1 }).withMessage("Enter password"),
];

