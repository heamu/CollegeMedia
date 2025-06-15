import express from 'express';
import User from '../models/user.model.js';
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js';
import mongoose from 'mongoose';
import Message from '../models/message.model.js';
import { sendMessage,fetchMessages } from '../controllers/message.controller.js';

const router = express.Router();

// Single route to get all chat users
router.get('/all-chat-users', ensureAuthenticated, async (req, res) => {
  try {
    // 1. Common users
    const user = await User.findById(req.user._id)
      .populate('commonChats', 'name profileImage _id')
      .populate('anonymousSentChats', 'name profileImage _id')
      .populate('anonymousReceivedChats', 'anonymousName profileImage _id');

    const commonUsers = (user.commonChats || []).map(u => ({
      _id: u._id,
      name: u.name,
      profileImage: u.profileImage
    }));

    const anonymousSentUsers = (user.anonymousSentChats || []).map(u => ({
      _id: u._id,
      name: u.name,
      profileImage: u.profileImage
    }));

    const anonymousReceivedUsers = (user.anonymousReceivedChats || []).map(u => ({
      _id: u._id,
      name: u.anonymousName && u.anonymousName.trim() ? u.anonymousName : 'Anonymous',
      profileImage: u.profileImage
    }));

    // Helper to get notification count for a user in a chat type
    async function getNotificationCount(fromUserId, toUserId, type) {
      return await Message.countDocuments({
        senderId: fromUserId,
        receiverId: toUserId,
        type,
        status: { $ne: 'read' }
      });
    }

    // For each user in each list, add notificationCount
    const myId = user._id.toString();
    const commonUsersWithNotifications = await Promise.all(
      commonUsers.map(async u => ({
        ...u,
        notificationCount: await getNotificationCount(u._id, myId, 'common')
      }))
    );    // For anonymous chats, notificationCount logic is inverted for received/sent
    const anonymousSentUsersWithNotifications = await Promise.all(
      anonymousSentUsers.map(async u => ({
        ...u,
        notificationCount: await getNotificationCount(u._id, myId, 'anon_received')
      }))
    );
    const anonymousReceivedUsersWithNotifications = await Promise.all(
      anonymousReceivedUsers.map(async u => ({
        ...u,
        notificationCount: await getNotificationCount(u._id, myId, 'anon_sent')
      }))
    );

    res.json({
      commonUsers: commonUsersWithNotifications,
      anonymousSentUsers: anonymousSentUsersWithNotifications,
      anonymousReceivedUsers: anonymousReceivedUsersWithNotifications
    });
  } catch (err) {
    //console.log(err);
    res.status(500).json({ error: 'Failed to fetch chat users' });
  }
});

// Route to add a user to a chat list by type
router.post('/add-user-to-chat-list', ensureAuthenticated, async (req, res) => {
  try {
    const { userIdToAdd, chatType } = req.body;
    if (!userIdToAdd || !chatType) {
      return res.status(400).json({ error: 'userIdToAdd and chatType are required' });
    }

    const validTypes = ['commonChats', 'anonymousSentChats', 'anonymousReceivedChats'];
    if (!validTypes.includes(chatType)) {
      return res.status(400).json({ error: 'Invalid chatType' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Only add if not already present
    const idx = user[chatType].indexOf(userIdToAdd);
    if (idx === -1) {
      user[chatType].unshift(userIdToAdd); // Add to the front
      await user.save();
    } else if (idx > 0) {
      // Move to front if not already first
      user[chatType].splice(idx, 1);
      user[chatType].unshift(userIdToAdd);
      await user.save();
    }

    res.json({ success: true, message: 'User added to chat list', chatType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add user to chat list' });
  }
});

// Route to fetch all messages with userId and chatType
router.get('/fetch-messages', ensureAuthenticated,fetchMessages);

// Route to send a message
router.post('/send-message', ensureAuthenticated,sendMessage );

export default router;