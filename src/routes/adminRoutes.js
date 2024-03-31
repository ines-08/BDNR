const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middlewares/adminMiddleware');
const { getAdminPage } = require('../controllers/adminController');

module.exports = function(db) {
    // router.use(adminMiddleware);
    router.get('/', getAdminPage.bind(null, db));
    return router;
}