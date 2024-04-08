const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getTicketsPage, buytickets } = require('../controllers/ticketsController');

module.exports = function(db) {
    router.use(authMiddleware);
    router.get('/', getTicketsPage.bind(null, db));
    router.post('/buytickets', buytickets.bind(null, db))
    return router;
}