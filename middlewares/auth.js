exports.isLoggedIn = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

exports.isGuest = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('/profile');
    }
    next();
}; 