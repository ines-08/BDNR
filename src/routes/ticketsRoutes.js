const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getTicketsPage } = require('../controllers/ticketsController');

module.exports = function(db) {
    router.use(authMiddleware);
    router.get('/', getTicketsPage.bind(null, db));
    return router;
}