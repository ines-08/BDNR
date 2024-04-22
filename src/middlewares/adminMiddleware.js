const adminMiddleware = (req, res, next) => {
    if (req.session.userInfo && req.session.userInfo.role === 'admin') {
        next();
    } else {
        req.flash('error', 'Non-admin users cannot access this page');
        res.redirect('/home');
    }
};

module.exports = adminMiddleware;