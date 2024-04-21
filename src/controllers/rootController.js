const utils = require('../utils/utils');

async function getRootPage(req, res) {

    if (req.session.userInfo) {
        res.redirect('/home');

        return;
    }

    res.render('index', { 
        error_message: req.flash('error'), 
        success_message: req.flash('success') 
    });
};

async function login(db, req, res) {
    const { username, password } = req.body;

    try {
        const user = await db.get(`user:${username}`)?.json();  
        if (user && user.password === password) {
            req.session.userInfo = { ...user, username: username };
            res.redirect('/home');
        } else {
            req.flash('error', 'Invalid login credentials');
            res.redirect('/');
        }

    } catch (error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/');
    }
};

async function logout(req, res) {
    try {
        req.session.userInfo = null;
        req.flash('success', 'Logout!');
        res.redirect('/');

    } catch (error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/');
    }
};

async function register(db, req, res) {
    const { name, email, username, password } = req.body;

    try {
        const user = await db.get(`user:${username}`);
    
        if (!user) {
            const userInfo = { name:name, email: email, password: password, role: utils.config.default_role };
            await db.put(`user:${username}`).value(JSON.stringify(userInfo));
            req.flash('success', 'Registed successfuly');
        } else {
            req.flash('error', 'Invalid register: username already exists!');
        }

        res.redirect('/');

    } catch (error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/');
    }
};

module.exports = {
    getRootPage,
    login,
    register,
    logout
};