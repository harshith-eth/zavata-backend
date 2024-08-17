const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const candidateInterviewRoutes = require('./routes/candidateInterviewRoutes');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/api/candidate-interview', candidateInterviewRoutes);

const apiKey = process.env.AZURE_OPENAI_KEY;
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const deploymentName = "SIA";
const apiVersion = "2023-09-15-preview";
const openAIEndpoint = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    const data = JSON.parse(message);

    if (data.type === 'startInterview') {
      ws.send(JSON.stringify({ type: 'system', message: 'Interview started' }));
    } else if (data.type === 'interviewQuestion') {
      const response = await handleInterviewQuestion(data.question, data.history);
      ws.send(JSON.stringify({ type: 'interviewResponse', message: response }));
    }
  });
});

const handleInterviewQuestion = async (question, history) => {
  try {
    const messages = history.map(item => ({
      role: item.role,
      content: item.content
    }));
    messages.push({ role: "user", content: question });

    const response = await axios.post(openAIEndpoint, {
      messages: messages,
      max_tokens: 200,
      temperature: 0.7
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      }
    });

    console.log('OpenAI API response:', response.data);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI", error.response ? error.response.data : error.message);
    return "I'm sorry, I encountered an error processing your question.";
  }
};

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

server.listen(80, () => console.log('Server is running on port 80'));