const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getHomePage } = require('../controllers/homeController');

module.exports = function(db) {
    router.use(authMiddleware);
    router.get('/', getHomePage.bind(null, db));
    return router;
}