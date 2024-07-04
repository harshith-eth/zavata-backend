const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const candidateInterviewRoutes = require('./routes/candidateInterview');
const authMiddleware = require('./middlewares/authMiddleware');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/api/candidate-interview', candidateInterviewRoutes);

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    const data = JSON.parse(message);

    if (data.type === 'startInterview') {
      ws.send(JSON.stringify({ type: 'system', message: 'Interview started' }));
    } else if (data.type === 'interviewQuestion') {
      const response = await handleInterviewQuestion(data.question);
      ws.send(JSON.stringify({ type: 'interviewResponse', message: response }));
    }
  });
});

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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

server.listen(80, () => console.log('Server is running on port 80'));
