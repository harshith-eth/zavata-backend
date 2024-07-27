// routes/ttsRoutes.js
const express = require('express');
const router = express.Router();
const ttsController = require('../controllers/ttsController');

router.post('/convert', ttsController.convertTextToSpeech);

module.exports = router;
