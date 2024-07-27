// routes/sttRoutes.js
const express = require('express');
const router = express.Router();
const sttController = require('../controllers/sttController');

router.post('/convert', sttController.convertSpeechToText);

module.exports = router;
