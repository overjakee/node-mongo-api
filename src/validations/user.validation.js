// validations/user.validation.js
const { body, param } = require('express-validator');

exports.createUserValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive integer'),
];

exports.updateUserValidator = [
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Email must be valid'),
    body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive integer'),
];
