const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Listen for Base64-encoded audio data from the client
  socket.on('audio-data', (base64Data) => {
    console.log('Received Base64 audio data from:', socket.id);

    // Broadcast the received Base64 audio data to other clients
    socket.broadcast.emit('audio-data', base64Data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server listening on port 5000');
});

app.get('/test', (req, res) => {
  res.send('Server is up and running!');
});