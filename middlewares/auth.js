const Event = require('../models/event');

//check if user is a guest
exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are already logged in');
        return res.redirect('/users/profile');
    }
};

//check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
};

//check if user is the author of the event
exports.isAuthor = async (req, res, next) => {
    try {
        let event = await Event.findById(req.params.id);
        if (event) {
            if (event.host == req.session.user.id) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        }
    } catch (err) {
        next(err);
    }
}; 