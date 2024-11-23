exports.isLoggedIn = (req, res, next) => {
    if (!req.session.userId) {
        req.session.errorMessage = 'You must be logged in to access this page';
        return res.redirect('/login');
    }
    next();
};

exports.isGuest = (req, res, next) => {
    if (req.session.userId) {
        req.session.errorMessage = 'You are already logged in';
        return res.redirect('/profile');
    }
    next();
}; 