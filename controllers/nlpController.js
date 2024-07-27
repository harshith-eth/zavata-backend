// controllers/nlpController.js
const nlpService = require('../services/nlpService');

const nlpController = {
  async processText(req, res) {
    try {
      const { text } = req.body;
      const result = await nlpService.analyzeText(text);
      res.status(200).send(result);
    } catch (error) {
      console.error('Error processing text:', error);
      res.status(500).send({ error: 'Failed to process text' });
    }
  },
};

module.exports = nlpController;
