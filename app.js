require('dotenv').config();

// MVC Pattern: Application Entry Point
// This file serves as the main configuration point connecting all MVC components

// Core imports
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();  // Create the Express application

// Model-related imports
const mongoose = require('mongoose');

// MongoDB Atlas Connection
const mongoURI = process.env.HL_MONGODB_URL;
mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
    });

// View engine setup
app.set('view engine', 'ejs');

// Controller-related imports
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');

// Middleware Stack
// These middleware functions process requests before they reach controllers
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// Session Configuration
app.use(session({
    secret: process.env.HL_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000 // 1 hour
    }
}));

// Flash messages middleware
app.use(flash());

// View-related Middleware
// Makes data available to all views
app.use((req, res, next) => {
    // Set default values for all views
    res.locals.title = 'ColorStack UNC Charlotte'; // Default title
    res.locals.user = req.session.user || null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});

// Add this before your route middleware
app.get('/', (req, res) => {
    res.render('index', { title: 'ColorStack UNC Charlotte' });
});

// Route/Controller Integration
app.use('/events', eventRoutes);  // Routes for event-related controllers
app.use('/', userRoutes);         // Routes for user-related controllers

const { notFound, handleError } = require('./middlewares/errorHandler');

// Add error handling middleware last
app.use(notFound);
app.use(handleError);

// Then your server start code
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
