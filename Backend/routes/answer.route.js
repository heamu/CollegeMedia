import express from "express"

import Answer from "../models/answer.model.js";
import Question from "../models/question.model.js";
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js';

const router = express.Router();

// POST /answer/submit - submit an answer to a question
router.post('/submit', ensureAuthenticated, async (req, res) => {
  try {
    const { content, imageUrl, questionId } = req.body;
    if (!content || !questionId) {
      return res.status(400).json({ message: 'Content and questionId are required' });
    }
    const answer = new Answer({
      body: content,
      imageUrl: imageUrl || '',
      question: questionId,
      author: req.user._id,
    });
    await answer.save();
    // Add answer to question's answers array
    await Question.findByIdAndUpdate(questionId, { $push: { answers: answer._id } });
    res.status(201).json({ message: 'Answer submitted', answer });
  } catch (err) {
    console.error('Error submitting answer:', err);
    res.status(500).json({ message: 'Failed to submit answer', error: err.message });
  }
});

// GET /answer/:answerId - get a single answer by id
router.get('/:answerId', async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId)
      .populate('author', 'name profileImage _id')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name profileImage _id' }
      });
    if (!answer) return res.status(404).json({ message: 'Answer not found' });
    res.json({ answer });
  } catch (err) {
    console.error('Error fetching answer:', err);
    res.status(500).json({ message: 'Failed to fetch answer', error: err.message });
  }
});

// Like/unlike an answer
router.post('/:answerId/like', ensureAuthenticated, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });
    const userId = req.user._id.toString();
    const hasLiked = answer.upvotes.map(id => id.toString()).includes(userId);
    if (hasLiked) {
      answer.upvotes = answer.upvotes.filter(id => id.toString() !== userId);
    } else {
      answer.upvotes.push(userId);
    }
    await answer.save();
    res.json({ liked: !hasLiked, upvotes: answer.upvotes.length });
  } catch (err) {
    res.status(500).json({ message: 'Failed to like/unlike answer', error: err.message });
  }
});

// Add a comment to an answer
router.post('/:answerId/comment', ensureAuthenticated, async (req, res) => {
  try {
    const { body } = req.body;
    if (!body) return res.status(400).json({ message: 'Comment body required' });
    const answer = await Answer.findById(req.params.answerId);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });
    const Comment = (await import('../models/comment.model.js')).default;
    const comment = new Comment({
      body,
      author: req.user._id,
      parentType: 'Answer',
      parentId: answer._id
    });
    await comment.save();
    answer.comments.unshift(comment._id);
    await answer.save();
    await comment.populate('author', 'name profileImage _id');
    res.status(201).json({ comment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
});

export default router;
