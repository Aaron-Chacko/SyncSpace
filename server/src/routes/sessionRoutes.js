const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:roomId', authMiddleware, sessionController.getSession);

module.exports = router;