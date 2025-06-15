import mongoose, { Schema } from "mongoose";
import './answer.model.js';
import './comment.model.js';
import ModerationQueue from "./moderationQueue.model.js";

const questionSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  imageFileId: {
    type: String,
    default: ''
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  upvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  savedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  answers: [{
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  tags: {
    type: [String],
    default: [],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// POST /question/:questionId/moderate - add to moderation queue
questionSchema.statics.addToModerationQueue = async function(questionId) {
  let queue = await ModerationQueue.findOne();
  if (!queue) queue = await ModerationQueue.create({});
  if (!queue.questionsPendingApproval.includes(questionId)) {
    queue.questionsPendingApproval.push(questionId);
    await queue.save();
  }
};

export default mongoose.model('Question', questionSchema);
