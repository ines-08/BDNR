const express = require('express');
const router = express.Router();
const { getRootPage, login, register, logout } = require('../controllers/rootController');

module.exports = function(db) {
    router.get('/', getRootPage);
    router.post('/login', login.bind(null, db));
    router.post('/register', register.bind(null, db));
    router.post('/logout', logout);
    return router;
}