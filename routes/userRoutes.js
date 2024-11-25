// MVC Pattern: Routes
// This file maps URLs to appropriate Controller functions

const express = require('express');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middlewares/auth');
const router = express.Router();

// Static pages - these should be FIRST
router.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

router.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us' });
});

// Routes for user registration
router.get('/users/new', isGuest, controller.new);
router.post('/users', isGuest, controller.create);

// Routes for user login/logout
router.get('/users/login', isGuest, controller.getUserLogin);
router.post('/users/login', isGuest, controller.login);
router.get('/users/logout', isLoggedIn, controller.logout);

// Route for user profile
router.get('/users/profile', isLoggedIn, controller.profile);

module.exports = router; 