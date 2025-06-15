import express from 'express';
import User from '../models/user.model.js';
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js';
import mongoose from 'mongoose';
import Message from '../models/message.model.js';
const { io, getReceiverSocketId } = await import('../lib/server.js');




export async function sendMessage(req, res) {
  try {
    const { receiverId, text, imageURL, type } = req.body;
    if (!receiverId || !type || (!text && !imageURL)) {
      return res.status(400).json({ error: 'receiverId, type, and text or imageURL are required' });
    }

    const message = await Message.create({
      senderId: req.user._id,
      receiverId,
      text: text || '',
      imageURL: imageURL || '',
      type
    });

    // Add sender to receiver's chat list if not already present
    const chatTypeMap = {
      'common': 'commonChats',
      'anon_sent': 'anonymousReceivedChats',
      'anon_received': 'anonymousSentChats'
    };
    const chatListField = chatTypeMap[type];
    let isNewChatUser = false;
    let receiver = null;
    if (chatListField) {
      receiver = await User.findById(receiverId);
      if (receiver && !receiver[chatListField].includes(req.user._id.toString())) {
        receiver[chatListField].unshift(req.user._id);
        await receiver.save();
        isNewChatUser = true;
      }
    }

    // After saving message and updating chat lists, notify receiver via websocket if online
    try {
      const { io, getReceiverSocketId } = await import('../lib/server.js');
      const receiverSocketId = getReceiverSocketId(receiverId.toString());
      if (receiverSocketId) {
        // Mark the message as delivered
        message.status = 'delivered';
        await message.save();
        // Notify the sender (a) that the message is delivered
        const senderSocketId = getReceiverSocketId(req.user._id.toString());
        if (senderSocketId) {
          io.to(senderSocketId).emit('messageDelivered', { messageId: message._id });
        }
        // Prepare newChatUser object (fields as in all-chat-users)
        let newChatUser = null;
        if (isNewChatUser) {
          let name = req.user.name;
          let profileImage = req.user.profileImage;
          if (type === 'anon_sent') {
            name = req.user.anonymousName && req.user.anonymousName.trim() ? req.user.anonymousName : 'Anonymous';
          }
          newChatUser = {
            _id: req.user._id,
            name,
            profileImage,
            notificationCount: 1,
            chatType: type // include chatType
          };
        }
        io.to(receiverSocketId).emit('receiveMessage', message);
        if (newChatUser) {
          io.to(receiverSocketId).emit('newChatUser', newChatUser);
        }
      }
    } catch (e) {
      // fail silently if socket not available
    }

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
}



 export async function fetchMessages(req, res)  {
  try {
    const { userId, chatType } = req.query;
    
    if (!userId || !chatType) {
      return res.status(400).json({ error: 'userId and chatType are required' });
    }

    const ObjectId = mongoose.Types.ObjectId;
    const myId = new ObjectId(req.user._id).toString();
    const otherId = new ObjectId(userId).toString();

    // Map chatType for fetching
    let typeToFetch = chatType;
    if (chatType === 'anon_received') typeToFetch = 'anon_sent';
    // else if (chatType === 'anon_sent') typeToFetch = 'anon_sent'; // redundant, but explicit
    // else if (chatType === 'common') typeToFetch = 'common';

    let messages = [];
    if (chatType === 'anon_received') {
      messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: otherId, type: 'anon_received' },
          { senderId: otherId, receiverId: myId, type: 'anon_sent' }
        ]
      }).sort({ createdAt: 1 });
    } else if (chatType === 'anon_sent') {
      messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: otherId, type: 'anon_sent' },
          { senderId: otherId, receiverId: myId, type: 'anon_received' }
        ]
      }).sort({ createdAt: 1 });
    } else if (chatType === 'common') {
      messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: otherId, type: 'common' },
          { senderId: otherId, receiverId: myId, type: 'common' }
        ]
      }).sort({ createdAt: 1 });
    } else {
      // fallback: fetch all between users
      messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: otherId },
          { senderId: otherId, receiverId: myId }
        ]
      }).sort({ createdAt: 1 });
    }
    res.json(messages);

    // Mark all messages from other user to me as read for this chatType
    let updateFilter = {};
    if (chatType === 'anon_received') {
      updateFilter = {
        senderId: otherId,
        receiverId: myId,
        type: 'anon_sent',
        status: { $ne: 'read' }
      };
    } else if (chatType === 'anon_sent') {
      updateFilter = {
        senderId: otherId,
        receiverId: myId,
        type: 'anon_received',
        status: { $ne: 'read' }
      };
    } else if (chatType === 'common') {
      updateFilter = {
        senderId: otherId,
        receiverId: myId,
        type: 'common',
        status: { $ne: 'read' }
      };
    } else {
      updateFilter = {
        senderId: otherId,
        receiverId: myId,
        status: { $ne: 'read' }
      };
    }
    await Message.updateMany(updateFilter, { $set: { status: 'read' } });

    // After fetching and marking messages as read, notify the other user if they are online and viewing this chat
    try {
      const { io, getReceiverSocketId } = await import('../lib/server.js');
      
      const otherSocketId = getReceiverSocketId(userId);
      if (otherSocketId) {
        
        let otherChatType = chatType;
        if (chatType === 'anon_sent') otherChatType = 'anon_received';
        else if (chatType === 'anon_received' || chatType === 'anon_recieve') otherChatType = 'anon_sent';
        // Emit an event to the other user with info about who read and what chatType
        io.to(otherSocketId).emit('allMessagesReadInChat', {
          readerId: req.user._id.toString(),
          chatType: otherChatType
        });
      }
    } catch (e) {
      
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}