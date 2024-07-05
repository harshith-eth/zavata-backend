const axios = require('axios');
require('dotenv').config();

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

  const response = await getOpenAIResponse(question);
  return response;
};

const getOpenAIResponse = async (question) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const endpoint = process.env.OPENAI_ENDPOINT;

  try {
    const response = await axios.post(`${endpoint}/v1/chat/completions`, {
      messages: [{ role: "user", content: question }],
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI", error);
    return "I'm sorry, I encountered an error processing your question.";
  }
};
