const express = require('express');
const router = express.Router();

// Import the controller functions
const userController = require('../controllers/userController');

// Route for user registration
router.post('/register', userController.register);

// Route for user login
router.post('/login', userController.login);

// Route to get the user profile (Protected route, requires authentication)
router.get('/profile', userController.authenticate, userController.getProfile);

// Route to update the user profile
router.put('/profile', userController.authenticate, userController.updateProfile);

// Route for password reset
router.post('/reset-password', userController.resetPassword);

// Route for deleting a user account
router.delete('/delete', userController.authenticate, userController.deleteAccount);

module.exports = router;
