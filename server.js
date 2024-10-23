const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors'); // Import cors

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Enable CORS for all routes
// Manually set CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Sample GET method
app.get('/test', (req, res) => {
  res.send('Server is up and running!');
});

// WebSocket connection for signaling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('signal', (data) => {
    console.log(`Signal received from ${data.from} to ${data.to}`);
    console.log(`Signal data: `, data.signal);
    io.to(data.to).emit('signal', { signal: data.signal, from: data.from });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
