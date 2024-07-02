const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('received: %s', message);
    // handle different message types (e.g., callUser, acceptCall) based on your logic
  });

  ws.send('something');
});

app.get('/test', (req, res) => {
  res.send('Server is running');
});

server.listen(80, () => console.log('Server is running on port 80'));
