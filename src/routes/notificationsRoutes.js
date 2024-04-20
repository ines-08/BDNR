const express = require('express');
const { getNotificationsPage, addNotifications } = require('../controllers/notificationsController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

module.exports = function(db) {
    router.use(authMiddleware);
    router.get('/', getNotificationsPage);
    router.post('/addnotifications', addNotifications.bind(null, db));
    return router;
}