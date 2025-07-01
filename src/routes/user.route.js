const express = require('express');
const { body, param } = require('express-validator');
const userController = require('../controllers/user.controller');
const validateRequest = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const userValidation = require('../validations/user.validation')

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
    userValidation.createUserValidator,
    validateRequest,
  ],
  userController.createUser
);

// PUT /api/users/:id
router.put(
  '/:id',
  [
    authMiddleware,
    userValidation.updateUserValidator,
    validateRequest,
  ],
  userController.updateUser
);

// DELETE /api/users/:id
router.delete(
  '/:id',
  [
    authMiddleware,
    param('id').isMongoId().withMessage('Invalid user ID'),
    validateRequest,
  ],
  userController.deleteUser
);

module.exports = router;
