// controllers/sttController.js
const sttService = require('../services/sttService');

const sttController = {
  async convertSpeechToText(req, res) {
    try {
      const { audioFilePath } = req.body;
      const result = await sttService.convertSpeechToText(audioFilePath);
      res.status(200).send(result);
    } catch (error) {
      console.error('Error converting speech to text:', error);
      res.status(500).send({ error: 'Failed to convert speech to text' });
    }
  },
};

module.exports = sttController;
