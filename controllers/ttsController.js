// controllers/ttsController.js
const ttsService = require('../services/ttsService');

const ttsController = {
  async convertTextToSpeech(req, res) {
    try {
      const { text } = req.body;
      const result = await ttsService.convertTextToSpeech(text);
      res.status(200).send(result);
    } catch (error) {
      console.error('Error converting text to speech:', error);
      res.status(500).send({ error: 'Failed to convert text to speech' });
    }
  },
};

module.exports = ttsController;
