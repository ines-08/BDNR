const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getProfilePage } = require('../controllers/profileController');

router.use(authMiddleware);
router.get('/', getProfilePage);

module.exports = router;