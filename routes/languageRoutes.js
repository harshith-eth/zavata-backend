// routes/languageRoutes.js
const express = require('express');
const router = express.Router();
const languageController = require('../controllers/languageController');

router.post('/process', languageController.processText);

module.exports = router;
