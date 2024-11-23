// 404 error handler
exports.notFound = (req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
};

// Error handler for internal server errors and other errors
exports.handleError = (err, req, res, next) => {
    if(!err.status) {
        err.status = 500;
        err.message = "Internal Server Error";
    }

    res.status(err.status);
    
    // For development purposes, you might want to see the error details
    console.log(err);

    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
        err.status = 400;
        const messages = Object.values(err.errors).map(e => e.message);
        req.flash('error', messages);
        return res.redirect('back');
    }

    // Handle mongoose duplicate key error
    if (err.code === 11000) {
        err.status = 400;
        req.flash('error', 'Email has already been registered');
        return res.redirect('back');
    }

    // Render the error page
    res.render('error', { error: err });
}; 