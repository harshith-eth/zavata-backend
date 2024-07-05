const express = require('express');
const router = express.Router();
const { getInterviewData, handleQuestion } = require('../controllers/candidateInterviewController');

router.get('/', getInterviewData);
router.post('/question', handleQuestion);

module.exports = router;
