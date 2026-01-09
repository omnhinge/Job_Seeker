const express = require('express');
const router = express.Router();
const {
  analyzeResume,
  generateCareerPlan,
  getAnalysis,
} = require('../controllers/analysisController');

router.post('/analyze', analyzeResume);
router.post('/career-plan', generateCareerPlan);
router.get('/:email', getAnalysis);

module.exports = router;