const authMiddleware = (req, res, next) => {
    if (req.session.userInfo) {
        next();
    } else {
        req.flash('error', 'You need to login first!');
        res.redirect('/');
    }
};

module.exports = authMiddleware;