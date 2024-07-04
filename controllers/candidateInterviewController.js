const axios = require('axios');

exports.getInterviewData = (req, res) => {
  res.json({ message: 'Interview data' });
};

exports.handleQuestion = async (req, res) => {
  const { question } = req.body;
  const response = await handleInterviewQuestion(question);
  res.json({ message: response });
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

  const response = await getAzureAIResponse(question);
  return response;
};

const getAzureAIResponse = async (question) => {
  const apiKey = '9FRk6D9DYS2mgM2HtDVRJwNRca1KQfVT';
  const endpoint = 'https://Meta-Llama-3-70B-Instruct-knfhq-serverless.eastus.inference.ai.azure.com/v1/chat/completions';

  try {
    const response = await axios.post(endpoint, {
      messages: [{ role: "user", content: question }],
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Azure AI", error);
    return "I'm sorry, I encountered an error processing your question.";
  }
};
