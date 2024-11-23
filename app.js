// require models
const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const eventRoutes = require('./routes/eventRoutes')
const mongoose = require('mongoose')
require('dotenv').config()
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');
const flash = require('connect-flash');

// create app
const app = express()

// configure app
let port = 3000
let host = 'localhost'
let url = process.env.HL_MONGODB_URL
app.set('view engine', 'ejs')

// Keep just the mongoose connection:
mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB Atlas!');
        // start server
        app.listen(port, host, () => {
            console.log(`Server is running at ${host}:${port}`)
        })
    })
    .catch(err => console.log(err.message))

// mount middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))
app.use(methodOverride('_method'))
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Make user data available to all templates
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});

// set up routes
// home page
app.get('/', (req, res) => {
    res.render('index')
})

// about page
app.get('/about', (req, res) => {
    res.render('about')
})

// contact page
app.get('/contact', (req, res) => {
    res.render('contact')
})

// middleware for events pages
app.use('/events', eventRoutes)
app.use('/', userRoutes)

// 404 error handler
app.use(errorHandler.notFound);

// Error handler
app.use(errorHandler.handleError);

