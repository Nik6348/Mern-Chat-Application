import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from './routes/chatRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const port = 5000;

mongoose.connect('mongodb://localhost:27017/chat-app');

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message);
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});