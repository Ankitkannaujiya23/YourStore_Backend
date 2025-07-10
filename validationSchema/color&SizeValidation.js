import { body } from "express-validator";

export const colorValidation = [
    body('name').trim().notEmpty().withMessage('Enter color name'),
    body('hex_code').trim().notEmpty().withMessage('Enter hex code of color')
];

export const sizeValidation = [
    body('label').trim().notEmpty().withMessage('Enter the size')
];

