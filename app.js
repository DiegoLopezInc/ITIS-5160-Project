// MVC Pattern: Application Entry Point
// This file serves as the main configuration point connecting all MVC components

// Model-related imports
const mongoose = require('mongoose')

// View engine setup
app.set('view engine', 'ejs')

// Controller-related imports
const eventRoutes = require('./routes/eventRoutes')
const userRoutes = require('./routes/userRoutes')

// Middleware Stack
// These middleware functions process requests before they reach controllers
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))
app.use(methodOverride('_method'))

// View-related Middleware
// Makes data available to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});

// Route/Controller Integration
app.use('/events', eventRoutes)  // Routes for event-related controllers
app.use('/', userRoutes)         // Routes for user-related controllers

