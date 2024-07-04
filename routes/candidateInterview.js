const express = require('express');
const router = express.Router();
const candidateInterviewController = require('../controllers/candidateInterviewController');

router.get('/', candidateInterviewController.getInterviewData);
router.post('/question', candidateInterviewController.handleQuestion);

module.exports = router;
