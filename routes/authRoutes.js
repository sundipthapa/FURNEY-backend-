const express = require('express'); // Import the Express library
const router = express.Router(); // Create a new router instance
const authController = require('../controller/authController'); // Import the authController module

// Route for creating a new user
router.route('/register').post(authController.createUser);

// Route for logging in a user
router.route('/login').post(authController.loginUser);

// Route for changing the password
router.route('/change_password').post(authController.changePassword);

// Route for forgot password
router.route('/forgot-password').post(authController.forgotPassword);

// Route for updating password using reset link
router.route('/reset-password/:id/:token').post(authController.updatePassword);

// Route for checking the reset password link
router.route('/reset-password/:id/:token').get(authController.updatePasswordLinkCheck);

// Route for updating user profile
router.route('/update_profile/:userId').put(authController.updateUserProfile);
// Route for updating user billing
router.route('/update_billing/:userId').put(authController.updateUserBilling);

// Route for getting a user by ID
router.route('/user/:userId').get(authController.getUserById);

// Route for getting all users (admin view)
router.route('/users').get(authController.getAllUsers);

// Export the router to be used in other parts of the application
module.exports = router;
