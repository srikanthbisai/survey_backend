const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');

router.post('/submit-survey', surveyController.submitSurvey);
router.get('/get-responses/:userId', surveyController.getResponses);
router.put('/update-survey', surveyController.updateSurvey);

module.exports = router;
