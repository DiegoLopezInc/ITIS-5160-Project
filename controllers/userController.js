const User = require('../models/user');

exports.getSignUp = (req, res) => {
    res.render('user/signup');
};

exports.postSignUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const user = new User({ firstName, lastName, email, password });
        await user.save();
        req.session.userId = user._id; // Log in user after registration
        res.redirect('/profile');
    } catch (error) {
        if (error.code === 11000) { // Duplicate email error
            res.render('user/signup', { error: 'Email already exists' });
        } else {
            res.render('user/signup', { error: error.message });
        }
    }
};

exports.getLogin = (req, res) => {
    res.render('user/login');
};

exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.render('user/login', { error: 'Invalid email or password' });
        }

        req.session.userId = user._id;
        res.redirect('/profile');
    } catch (error) {
        res.render('user/login', { error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const events = await Event.find({ author: req.session.userId });
        res.render('user/profile', { user, events });
    } catch (error) {
        res.redirect('/login');
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}; 