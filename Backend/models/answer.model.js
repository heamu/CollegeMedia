import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
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
    default: false
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
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('Answer', answerSchema);
