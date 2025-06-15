import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const io = new Server(server, {
  cors: {
    origin: [FRONTEND_URL],
    methods: ['GET', 'POST'],
    credentials: true //  allow credentials for CORS
  },
});

// used to store online users
const userSocketMap = {}; // {userId: socketId}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on('connection', (socket) => {
  // Log before connection is fully established
  //console.log('[Socket.IO] A user connected:', socket.id, 'userId:', socket.handshake.query.userId);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // Listen for send_read_message event from client
  socket.on('send_read_message', async ({ messageId, senderId, receiverId, chatType }) => {
   // console.log("hello i am king of the world",messageId);
    try {
      // Update the single message to 'read'
      const Message = (await import('../models/message.model.js')).default;
      const updated = await Message.findByIdAndUpdate(
        messageId,
        { $set: { status: 'read' } },
        { new: true }
      );
      if (updated) {
        // Notify the sender (if online) that their message has been read
        const senderSocketId = getReceiverSocketId(updated.senderId.toString());
        if (senderSocketId) {
          io.to(senderSocketId).emit('messageRead', {
            messageId,
            senderId: updated.senderId.toString(),
            receiverId: updated.receiverId.toString(),
            chatType: updated.type
          });
        }
      }
    } catch (err) {
      console.error('[Socket.IO] Error handling send_read_message:', err);
    }
  });

  socket.on('disconnect', () => {
    //console.log('[Socket.IO] A user disconnected:', socket.id, 'userId:', userId);
    if (userId) delete userSocketMap[userId];
  });
});

export { io, app, server };
