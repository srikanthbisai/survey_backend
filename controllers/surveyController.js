const User = require('../models/User');
const SurveyResponse = require('../models/SurveyResponse');

const surveyController = {
  async submitSurvey(req, res) {
    try {
      const { userId, answers } = req.body;
      console.log('Received survey submission:', { userId, answers });

      const user = await User.findOne({ email: userId });
      console.log('Found user:', user);

      if (!user) {
        throw new Error('User not found');
      }

      const surveyResponse = new SurveyResponse({ userId, answers });
      const savedResponse = await surveyResponse.save();
      console.log('Saved survey response:', savedResponse);

      user.hasSubmittedSurvey = true;
      await user.save();

      res.json({
        message: 'Survey submitted successfully',
        surveyId: savedResponse._id
      });
    } catch (error) {
      console.error('Survey submission error:', error);
      res.status(400).json({
        error: error.message,
        details: error.toString()
      });
    }
  },

  async getResponses(req, res) {
    try {
      const userId = req.params.userId;
      console.log('Fetching responses for user:', userId);

      const surveyResponse = await SurveyResponse.findOne(
        { userId: userId }
      ).sort({ submittedAt: -1 });

      console.log('Found survey response:', surveyResponse);

      if (!surveyResponse) {
        return res.status(200).json({
          success: false,
          answers: [],
          message: 'No survey responses found'
        });
      }

      res.status(200).json({
        success: true,
        answers: surveyResponse.answers,
        submittedAt: surveyResponse.submittedAt
      });
    } catch (error) {
      console.error('Error fetching survey responses:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  },

  async updateSurvey(req, res) {
    try {
      const { userId, answers } = req.body;
      console.log('Updating survey for user:', userId);

      const mostRecentResponse = await SurveyResponse.findOne(
        { userId: userId }
      ).sort({ submittedAt: -1 });

      if (!mostRecentResponse) {
        return res.status(404).json({
          success: false,
          error: 'Survey response not found'
        });
      }

      const updatedResponse = await SurveyResponse.findByIdAndUpdate(
        mostRecentResponse._id,
        {
          $set: {
            answers: answers,
            updatedAt: new Date()
          }
        },
        { new: true }
      );

      if (!updatedResponse) {
        return res.status(404).json({
          success: false,
          error: 'Failed to update survey response'
        });
      }

      console.log('Survey updated successfully:', updatedResponse);

      res.status(200).json({
        success: true,
        message: 'Survey updated successfully',
        response: updatedResponse
      });
    } catch (error) {
      console.error('Error updating survey:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  }
};

module.exports = surveyController;
