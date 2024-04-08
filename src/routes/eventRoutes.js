const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getEventPage, addFavourite, removeFavourite } = require('../controllers/eventController');

module.exports = function(db) {
    router.use(authMiddleware);
    router.get('/', getEventPage.bind(null, db));
    router.post('/add-favourite', addFavourite.bind(null, db));
    router.post('/remove-favourite', removeFavourite.bind(null, db));
    return router;
}