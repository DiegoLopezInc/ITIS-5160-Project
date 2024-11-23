const User = require('../models/user');

exports.getSignUp = (req, res) => {
    res.render('user/signup');
};

exports.postSignUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const user = new User({ firstName, lastName, email, password });
        await user.save();
        req.session.successMessage = 'Registration successful! Please log in.';
        res.redirect('/login');
    } catch (error) {
        if (error.code === 11000) {
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
        req.session.successMessage = 'Successfully logged in!';
        res.redirect('/');
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
    req.session.destroy(err => {
        if(err) {
            console.log(err);
        }
        res.redirect('/login');
    });
}; 