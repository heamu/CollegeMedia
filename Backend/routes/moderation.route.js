import express from 'express'
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js';
import ensureAdmin from '../middlewares/ensureIsAdmin.js';
import ensureAdminOrModerator from '../middlewares/ensureIsAdminOrModerator.js';
import ModerationQueue from '../models/moderationQueue.model.js';
import Question from '../models/question.model.js';
import User from '../models/user.model.js';

const router = express.Router();

// GET /pending - Get all questions pending approval for moderators
router.get('/pending', ensureAuthenticated, ensureAdminOrModerator, async (req, res) => {
  try {
    const queue = await ModerationQueue.findOne({}).populate({
      path: 'questionsPendingApproval',
      select: 'title body isAnonymous isApproved _id',
    });
    const questions = queue?.questionsPendingApproval || [];
    res.json({ questions });
  } catch (err) {
    console.error('Error in GET /pending:', err);
    res.status(500).json({ message: 'Failed to fetch questions for moderation', error: err.message, stack: err.stack });
  }
});

// PATCH /approve/:questionId - Approve a question
router.patch('/approve/:questionId', ensureAuthenticated, ensureAdminOrModerator, async (req, res) => {
  try {
    const { questionId } = req.params;
    // Mark question as approved
    const question = await Question.findByIdAndUpdate(questionId, { isApproved: true }, { new: true });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    // Remove from moderation queue
    await ModerationQueue.findOneAndUpdate({}, { $pull: { questionsPendingApproval: questionId } });
    res.json({ message: 'Question approved', question });
  } catch (err) {
    console.error('Error in PATCH /approve/:questionId:', err);
    res.status(500).json({ message: 'Failed to approve question', error: err.message, stack: err.stack });
  }
});

// DELETE /reject/:questionId - Reject and delete a question
router.delete('/reject/:questionId', ensureAuthenticated, ensureAdminOrModerator, async (req, res) => {
  try {
    const { questionId } = req.params;
    // Delete the question
    const question = await Question.findByIdAndDelete(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    // Remove from moderation queue
    await ModerationQueue.findOneAndUpdate({}, { $pull: { questionsPendingApproval: questionId } });
    res.json({ message: 'Question rejected and deleted', questionId });
  } catch (err) {
    console.error('Error in DELETE /reject/:questionId:', err);
    res.status(500).json({ message: 'Failed to reject question', error: err.message, stack: err.stack });
  }
});

// GET /moderators - Get all moderators (admin only)
router.get('/moderators', ensureAuthenticated, ensureAdminOrModerator, async (req, res) => {
  try {
    // Only allow admins to fetch the list of moderators
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Only admins can view moderators list' });
    }
    // Fetch moderator IDs from ModerationQueue
    const queue = await ModerationQueue.findOne({});
    const moderatorIds = (queue?.moderators || []).map(id => id.toString());
    // Fetch moderator user details
    const moderators = await User.find({ _id: { $in: moderatorIds } }, 'username email _id profileImage name');
    res.json({ moderators });
  } catch (err) {
    console.error('Error in GET /moderators:', err);
    res.status(500).json({ message: 'Failed to fetch moderators', error: err.message, stack: err.stack });
  }
});

// PATCH /remove-moderator/:userId - Remove a user as moderator (admin only)
router.patch('/remove-moderator/:userId', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    // Remove userId from ModerationQueue.moderators
    await ModerationQueue.findOneAndUpdate({}, { $pull: { moderators: userId } });
    // Update user document to remove moderator status
    await User.findByIdAndUpdate(userId, { isContentModerator: false });
    res.json({ message: 'Moderator removed', userId });
  } catch (err) {
    console.error('Error in PATCH /remove-moderator/:userId:', err);
    res.status(500).json({ message: 'Failed to remove moderator', error: err.message, stack: err.stack });
  }
});

// PATCH /add-moderator/:userId - Add a user as moderator (admin only)
router.patch('/add-moderator/:userId', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    // Add userId to ModerationQueue.moderators if not already present
    await ModerationQueue.findOneAndUpdate({}, { $addToSet: { moderators: userId } });
    // Update user document to set moderator status
    await User.findByIdAndUpdate(userId, { isContentModerator: true });
    res.json({ message: 'Moderator added', userId });
  } catch (err) {
    console.error('Error in PATCH /add-moderator/:userId:', err);
    res.status(500).json({ message: 'Failed to add moderator', error: err.message, stack: err.stack });
  }
});

export default router;