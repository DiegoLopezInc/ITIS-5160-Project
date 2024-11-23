const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middlewares/auth');

// Auth routes
router.get('/signup', isGuest, userController.getSignUp);
router.post('/signup', isGuest, userController.postSignUp);
router.get('/login', isGuest, userController.getLogin);
router.post('/login', isGuest, userController.postLogin);
router.get('/profile', isLoggedIn, userController.getProfile);
router.get('/logout', isLoggedIn, userController.logout);

module.exports = router; 