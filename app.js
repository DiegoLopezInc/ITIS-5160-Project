// require models
const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const eventRoutes = require('./routes/eventRoutes')
const mongoose = require('mongoose')
require('dotenv').config()
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');


// create app
const app = express()


// configure app
let port = 3000
let host = 'localhost'
let url = process.env.HL_MONGODB_URL
app.set('view engine', 'ejs')

// connect to mongo
mongoose.connect(url)
    .then(() => {
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

// Make user data available to all templates
app.use((req, res, next) => {
    res.locals.user = req.session.userId;
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

// login page
app.get('/login', (req, res) => {
    res.render('login')
})

// signup page
app.get('/signup', (req, res) => {
    res.render('signup')
})

// middleware for events pages
app.use('/events', eventRoutes)
app.use('/', userRoutes)

// error handling
app.use((req, res, next) => {
    let err = new Error(`The server cannot locate ${req.url}`)
    err.status = 404

    next(err)
})

app.use((err, req, res, next) => {
    console.log(err.stack)

    if (!err.status) {
        err.status = 500
        err.message = 'Internal server error'
    }

    res.status(err.status)
    res.render('error', { error: err })
})

