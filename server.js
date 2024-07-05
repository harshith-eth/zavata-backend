const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const axios = require('axios');
require('dotenv').config();
const SpeechSDK = require('microsoft-cognitiveservices-speech-sdk');

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

// Audio processing functions
const textToSpeech = (text) => {
  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(process.env.AZURE_SPEECH_KEY, process.env.AZURE_SPEECH_REGION);
  const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
  const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

  synthesizer.speakTextAsync(text,
    result => {
      if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
        console.log("TTS: Synthesis finished.");
      } else {
        console.error("TTS: Speech synthesis canceled, " + result.errorDetails);
      }
      synthesizer.close();
    },
    error => {
      console.error("TTS: Error synthesizing speech: " + error);
      synthesizer.close();
    });
};

const speechToText = (ws) => {
  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(process.env.AZURE_SPEECH_KEY, process.env.AZURE_SPEECH_REGION);
  const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
  const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

  recognizer.recognizeOnceAsync(result => {
    console.log('STT: RecognizeOnceAsync result:', result);
    if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
      console.log(`STT: Recognized: ${result.text}`);
      ws.send(JSON.stringify({ type: 'interviewQuestion', question: result.text })); // Send recognized text to server
    } else {
      console.error("STT: Error recognizing speech: " + result.errorDetails);
    }
    recognizer.close();
  }, error => {
    console.error("STT: Recognizer error: ", error);
  });
};

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

server.listen(80, () => console.log('Server is running on port 80'));
