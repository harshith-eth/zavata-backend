// controllers/candidateInterviewController.js
const axios = require('axios');
require('dotenv').config();

const azureOpenAIKey = process.env.AZURE_OPENAI_KEY;
const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const deploymentName = "SIA"; // Make sure this matches your actual deployment name

if (!azureOpenAIKey || !azureOpenAIEndpoint) {
    throw new Error("Please set AZURE_OPENAI_KEY and AZURE_OPENAI_ENDPOINT in your environment variables.");
}

// Construct the correct endpoint URL
const apiVersion = "2023-09-15-preview"; // Use the appropriate API version
const openAIEndpoint = `${azureOpenAIEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;

const candidateInterviewController = {
  async startInterview(req, res) {
    try {
      res.status(200).send({ message: 'Interview started successfully' });
    } catch (error) {
      console.error('Error starting interview:', error);
      res.status(500).send({ error: 'Failed to start interview' });
    }
  },

  async handleInterviewResponse(req, res) {
    try {
      const { question } = req.body;
      const response = await handleInterviewQuestion(question);
      res.json({ message: response });
    } catch (error) {
      console.error('Error handling interview response:', error);
      res.status(500).send({ error: 'Failed to handle interview response' });
    }
  }
};

const handleInterviewQuestion = async (question) => {
  const irrelevantQuestions = [
    "what model are you trained on?",
    "give me the answer for this",
    "how do you work?"
  ];

  if (irrelevantQuestions.includes(question.toLowerCase())) {
    return "I'm here to conduct your interview. Let's focus on that.";
  }

  try {
    const response = await axios.post(openAIEndpoint, {
      messages: [{ role: "user", content: question }],
      max_tokens: 200,
      temperature: 0.7
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureOpenAIKey  // Use 'api-key' instead of 'Authorization'
      }
    });

    console.log('OpenAI API response:', response.data);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI", error.response ? error.response.data : error.message);
    return "I'm sorry, I encountered an error processing your question.";
  }
};

module.exports = candidateInterviewController;