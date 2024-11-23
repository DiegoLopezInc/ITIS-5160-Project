// MVC Pattern: Routes
// This file maps URLs to appropriate Controller functions

const express = require('express');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middleware/auth');
const router = express.Router();

// Routes direct requests to appropriate Controller actions
router.get('/new', isGuest, controller.new);
router.post('/', isGuest, controller.create);

module.exports = router; 