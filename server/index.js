require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to the frontend URL
    methods: ["GET", "POST"]
  }
});

// Game State (InMemory for now)
const gameState = {
  players: {}, // socketId -> { id, name, score, status }
  matches: {}, // matchId -> { status, level, timer, ... }
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Basic Lobby Logic
  socket.on('join_lobby', (data) => {
    gameState.players[socket.id] = {
      id: socket.id,
      name: data.name || `Player-${socket.id.substr(0,4)}`,
      score: 0,
      status: 'idle'
    };
    socket.emit('lobby_update', gameState);
    io.emit('player_joined', gameState.players[socket.id]);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete gameState.players[socket.id];
    io.emit('player_left', socket.id);
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', players: Object.keys(gameState.players).length });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
