// server/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  socket.on('callUser', (data) => {
    io.to(data.userToCall).emit('callUser', { signal: data.signalData, from: data.from });
  });

  socket.on('acceptCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });
});
app.get('/test', (req, res) => {
  res.send('Server is running');
});
server.listen(4000, () => console.log('Server is running on port 4000'));
