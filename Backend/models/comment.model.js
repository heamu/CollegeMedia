import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentType: {
    type: String,
    enum: ['Question', 'Answer'],
    required: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'parentType'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);
