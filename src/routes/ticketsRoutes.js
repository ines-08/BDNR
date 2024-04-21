const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getTicketsPage, buyTickets, deleteTickets } = require('../controllers/ticketsController');

module.exports = function(db) {
    router.use(authMiddleware);
    router.get('/', getTicketsPage.bind(null, db));
    router.post('/buytickets', buyTickets.bind(null, db));
    router.post('/deletetickets', deleteTickets.bind(null, db));
    return router;
}