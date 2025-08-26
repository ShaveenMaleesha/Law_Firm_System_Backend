const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Admin routes
router.post('/admin/register', authController.registerAdmin);
router.post('/admin/login', authController.loginAdmin);

// Client routes
router.post('/client/register', authController.registerClient);
router.post('/client/login', authController.loginClient);

// Lawyer routes
router.post('/lawyer/register', authController.registerLawyer);
router.post('/lawyer/login', authController.loginLawyer);

// Protected routes
router.get('/profile', auth, authController.getProfile);
router.put('/change-password', auth, authController.changePassword);

module.exports = router;
