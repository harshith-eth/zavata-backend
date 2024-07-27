// services/nlpService.js
const { OpenAIApi, Configuration } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.AZURE_OPENAI_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
});
const openai = new OpenAIApi(configuration);

const nlpService = {
  async analyzeText(text) {
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: text,
        max_tokens: 150,
      });
      return { analysis: response.data.choices[0].text.trim() };
    } catch (error) {
      console.error("Error analyzing text:", error);
      throw new Error("Failed to analyze text");
    }
  },
};

module.exports = nlpService;
