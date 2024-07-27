// routes/nlpRoutes.js
// This file manages routes for NLP services

const express = require('express');
const router = express.Router();
const nlpController = require('../controllers/nlpController');

router.post('/process', nlpController.processText);

module.exports = router;
