import express from "express"
import Question from "../models/question.model.js";
import Comment from '../models/comment.model.js';
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js';
import ModerationQueue from '../models/moderationQueue.model.js';

const router = express.Router()

// GET /question/feed - returns questions matching user's tags
router.get('/feed', ensureAuthenticated, async (req, res) => {
  try {
    const user = req.user;
   // console.log('User tags:', user.tags, 'Types:', user.tags && user.tags.map(t => typeof t));
    if (!user.tags || user.tags.length === 0) {
      return res.json({ questions: [] });
    }
    // Diagnostic: log tags/types for first 3 questions in DB
    const allQuestions = await Question.find({}).limit(3);
    allQuestions.forEach((q, i) => {
     // console.log(`Q${i+1} tags:`, q.tags, 'Types:', q.tags && q.tags.map(t => typeof t));
    });
    // Find questions where at least one tag matches
    const query = {
      isApproved: true,
      tags: { $in: user.tags }
    };
    const questions = await Question.find(query).sort({ createdAt: -1 });
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch feed', error: err.message });
  }
});

// GET /question/all-ids - returns all question IDs (for feed)
router.get('/all-ids', async (req, res) => {
  //console.log('hello from /all-ids')
  try {
    const questions = await Question.find({ isApproved: true }, '_id').sort({ createdAt: -1 });
    res.json({ ids: questions.map(q => q._id) });
  } catch (err) {
    console.error('Error in /all-ids:', err);
    res.status(500).json({ message: 'Failed to fetch question ids', error: err.message, stack: err.stack });
  }
});



// GET /question/:questionId
router.get('/:questionId', async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId)
      .populate('author', 'name profileImage _id')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name profileImage _id' }
      });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json({ question });
  } catch (err) {
    console.error('Error in /:questionId:', err);
    res.status(500).json({ message: 'Failed to fetch question', error: err.message, stack: err.stack });
  }
});

// GET /question/:questionId/comments - get all comments for a question, populated
router.get('/:questionId/comments', async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId).populate({
      path: 'comments',
      populate: { path: 'author', select: 'name profileImage _id' }
    });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json({ comments: question.comments });
  } catch (err) {
    console.error('Error in /:questionId/comments:', err);
    res.status(500).json({ message: 'Failed to fetch comments', error: err.message, stack: err.stack });
  }
});

// POST /question/:questionId/comment - add a comment to a question
router.post('/:questionId/comment', ensureAuthenticated, async (req, res) => {
  try {
    const { body } = req.body;
    if (!body || !body.trim()) return res.status(400).json({ message: 'Comment body is required' });
    const question = await Question.findById(req.params.questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    // Create comment
    const comment = await Comment.create({
      body,
      author: req.user._id,
      parentType: 'Question',
      parentId: question._id
    });
    // Add comment to question
    question.comments.unshift(comment._id);
    await question.save();
    // Populate author for response
    await comment.populate('author', 'name profileImage _id');
    res.status(201).json({ message: 'Comment added', comment });
  } catch (err) {
    console.error('Error in POST /:questionId/comment:', err);
    res.status(500).json({ message: 'Failed to add comment', error: err.message, stack: err.stack });
  }
});

// POST /question/:questionId/like - like or unlike a question
router.post('/:questionId/like', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const question = await Question.findById(req.params.questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    const index = question.upvotes.findIndex(u => u.toString() === userId.toString());
    let liked;
    if (index === -1) {
      question.upvotes.push(userId);
      liked = true;
    } else {
      question.upvotes.splice(index, 1);
      liked = false;
    }
    await question.save();
    res.json({ liked, upvotes: question.upvotes.length });
  } catch (err) {
    console.error('Error in POST /:questionId/like:', err);
    res.status(500).json({ message: 'Failed to like/unlike question', error: err.message });
  }
});

// POST /question/:questionId/save - save or unsave a question
router.post('/:questionId/save', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const question = await Question.findById(req.params.questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    const index = question.savedBy.findIndex(u => u.toString() === userId.toString());
    let saved;
    const User = (await import('../models/user.model.js')).default;
    if (index === -1) {
      question.savedBy.push(userId);
      // Add questionId to user's savedPosts
      await User.findByIdAndUpdate(userId, { $addToSet: { savedPosts: question._id } });
      saved = true;
    } else {
      question.savedBy.splice(index, 1);
      // Remove questionId from user's savedPosts
      await User.findByIdAndUpdate(userId, { $pull: { savedPosts: question._id } });
      saved = false;
    }
    await question.save();
    res.json({ saved, savedBy: question.savedBy.length });
  } catch (err) {
    console.error('Error in POST /:questionId/save:', err);
    res.status(500).json({ message: 'Failed to save/unsave question', error: err.message });
  }
});


export default router;