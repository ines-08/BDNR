const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getEventPage } = require('../controllers/eventController');

module.exports = function(db) {
    router.use(authMiddleware);
    router.get('/', getEventPage.bind(null, db));
    return router;
}