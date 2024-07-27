// services/languageService.js
const axios = require("axios");

const languageService = {
  async processText(text) {
    try {
      const response = await axios.post(
        process.env.AZURE_LANGUAGE_ENDPOINT,
        { documents: [{ id: "1", text }] },
        {
          headers: {
            "Ocp-Apim-Subscription-Key": process.env.AZURE_LANGUAGE_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      return { processedText: response.data.documents[0].detectedLanguages[0].name };
    } catch (error) {
      console.error("Error processing text:", error);
      throw new Error("Failed to process text");
    }
  },
};

module.exports = languageService;
