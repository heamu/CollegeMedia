import express from "express"
import ensureAuthenticated from "../middlewares/ensureAuthenticated.js";
import User from "../models/user.model.js"
import ModerationQueue from '../models/moderationQueue.model.js';
import Question from '../models/question.model.js';

export async function updateTags   (req, res)  {
  const userId = req.user._id; // from session
  const tagsToUpdate = req.body.tags;
  const updatedUser = await User.findByIdAndUpdate(userId, { tags: tagsToUpdate }, { new: true });
  res.json({ message: 'Tags updated', user: updatedUser });
}


export async function updateProfile (req, res){
  const userId = req.user._id;
  //console.log("from updateProfile : ",req.user)
  const { name, bio, tags, profileImage, imageFileId } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(bio && { bio }),
        ...(tags && { tags }),
        ...(profileImage !== undefined ? { profileImage } : {}),
        ...(imageFileId !== undefined ? { imageFileId } : {}),
      },
      { new: true }
    );
    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
}



export async function askQuestion (req, res)  {
  const userId = req.user._id;
  const { question, tags, imageUrl, imageFileId, isAnonymous } = req.body;
  try {
    // Create a new Question document
    const isAnon = !!isAnonymous;
    const isApproved = isAnon ? false : true;
    const newQuestion = await Question.create({
      title: question.slice(0, 100),
      body: question,
      author: userId,
      tags: tags || [],
      imageUrl: imageUrl || '',
      imageFileId: imageFileId || '',
      isAnonymous: isAnon,
      isApproved
    });
    // Add question to user's questions array
    const updatedUser = await User.findByIdAndUpdate(userId, { $push: { questions: newQuestion._id } }, { new: true });
    // Add to moderation queue if anonymous
    if (isAnon) {
      // Add question to questionsPendingApproval in ModerationQueue
      await ModerationQueue.findOneAndUpdate(
        {},
        { $addToSet: { questionsPendingApproval: newQuestion._id } },
        { upsert: true }
      );
    }
    res.status(201).json({ message: 'Question posted', question: newQuestion, user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Failed to post question', error: err.message });
  }
}


export async function editAnonymousName (req, res)  {
  const userId = req.user._id;
  const { anonymousName } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { anonymousName },
      { new: true }
    );
    res.json({ message: 'Anonymous name updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update anonymous name', error: err.message });
  }
}

export async function getPublicProfile(req, res) {
  try {
    const user = await User.findById(req.params.userId).select('-password -googleId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Populate only non-anonymous questions
    const questionsData = await Question.find({ _id: { $in: user.questions }, isAnonymous: false })
      .sort({ createdAt: -1 });
    res.json({ user: { ...user.toObject(), questionsData } });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user profile', error: err.message });
  }
}

export async function searchUser (req, res) {
  try {
    const { query } = req.query;
    if (!query || query.trim() === '') {
      return res.json({ users: [] });
    }
    // Case-insensitive partial match on name, limit 5
    const users = await User.find({ name: { $regex: query, $options: 'i' } })
      .select('name profileImage _id')
      .limit(5);
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to search users', error: err.message });
  }
}


export async function updateAnonymousName (req, res)  {
  const userId = req.user._id;
  const { anonymousName } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { anonymousName },
      { new: true }
    );
    res.json({ message: 'Anonymous name updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update anonymous name', error: err.message });
  }
}