import { body } from "express-validator";

const addressValidation = [
    body('fullname').notEmpty().withMessage("Name is required.").isLength({ min: 2 }).withMessage("Name is too short"),
    body('email').notEmpty().withMessage("Email is required").isEmail(),
    body('mobileno').notEmpty().withMessage("Mobile is required").matches(/^[6-9]\d{9}$/).withMessage("Invalid mobile"),
    body("address_line1").notEmpty().withMessage("Address line1 is required").isLength({ min: 5 }).withMessage("Address 1 at least 5 chars"),
    body("address_line2").notEmpty().withMessage("Address line2 is required"),
    body("city").notEmpty().withMessage("City required hai"),
    body("state")
        .notEmpty().withMessage("State is required"),

    body("pincode")
        .notEmpty().withMessage("Pincode is required")
        .isLength({ min: 6, max: 6 }).withMessage("Pincode should be 6 digit")
        .isNumeric().withMessage("Pincode should be numeric"),
];

export default addressValidation;