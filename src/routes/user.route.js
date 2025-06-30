const express = require('express');
const { body, param } = require('express-validator');
const userController = require('../controllers/user.controller');
const validateRequest = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// GET /api/users?page=1&limit=10
router.get('/', userController.getUsers);

// GET /api/users/:id
router.get(
  '/:id',
  [
    authMiddleware,
    param('id').isMongoId().withMessage('Invalid user ID'),
    validateRequest,
  ],
  userController.getUserById
);

// POST /api/users
router.post(
  '/',
  [
    authMiddleware,
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive integer'),
    validateRequest,
  ],
  userController.createUser
);

// PUT /api/users/:id
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Email must be valid'),
    body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive integer'),
    validateRequest,
  ],
  userController.updateUser
);

// DELETE /api/users/:id
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid user ID'),
    validateRequest,
  ],
  userController.deleteUser
);

module.exports = router;
