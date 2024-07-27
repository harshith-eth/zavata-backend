// routes/candidateInterviewRoutes.js
const express = require('express');
const router = express.Router();
const candidateInterviewController = require('../controllers/candidateInterviewController');

router.post('/start', candidateInterviewController.startInterview);
router.post('/response', candidateInterviewController.handleInterviewResponse);

module.exports = router;
