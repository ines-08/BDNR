const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getProfilePage } = require('../controllers/profileController');

module.exports = function(db) {
    router.use(authMiddleware);
    router.get('/', getProfilePage.bind(null, db));
    return router;
}