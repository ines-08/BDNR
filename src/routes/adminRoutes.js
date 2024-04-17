const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middlewares/adminMiddleware');
const { getAdminPage, createEvent } = require('../controllers/adminController');

module.exports = function(db) {
    router.use(adminMiddleware);
    router.get('/', getAdminPage.bind(null, db));
    router.post('/createEvent', createEvent.bind(null, db));
    return router;
}