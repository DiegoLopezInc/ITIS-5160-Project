const User = require('../models/user');
const Event = require('../models/event');
const bcrypt = require('bcrypt');

exports.new = (req, res) => {
    return res.render('./user/new');
};

exports.create = async (req, res, next) => {
    try {
        let user = new User(req.body);
        user = await user.save();
        req.flash('success', 'Registration successful! Please login.');
        res.redirect('/users/login');
    } catch(err) {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('/users/new');
        }
        if(err.code === 11000) {
            req.flash('error', 'Email address has already been used');
            return res.redirect('/users/new');
        }
        next(err);
    }
};

exports.getUserLogin = (req, res) => {
    return res.render('./user/login');
};

exports.login = async (req, res, next) => {
    try {
        let {email, password} = req.body;
        if (email && password) {
            let user = await User.findOne({ email });
            if (user) {
                let result = await bcrypt.compare(password, user.password);
                if(result) {
                    req.session.user = {id: user._id, firstName: user.firstName};
                    req.flash('success', 'You have successfully logged in');
                    return res.redirect('/users/profile');
                } else {
                    req.flash('error', 'Wrong password');
                    return res.redirect('/users/login');
                }
            } else {
                req.flash('error', 'Wrong email address');
                return res.redirect('/users/login');
            }
        } else {
            req.flash('error', 'Email and password are required');
            return res.redirect('/users/login');
        }
    } catch(err) {
        next(err);
    }
};

exports.profile = async (req, res, next) => {
    try {
        let user = await User.findById(req.session.user.id);
        let events = await Event.find({host: user._id});
        return res.render('./user/profile', {user, events});
    } catch(err) {
        next(err);
    }
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if(err) {
            next(err);
        } else {
            res.redirect('/');
        }
    });
}; 