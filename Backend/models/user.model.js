import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  anonymousName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
  },
  googleId: {
  type: String,
  unique: true,
  sparse: true // Ensures no conflict for local users without googleId
},
 profileImage: {
  type: String,
  default: '',
},
  bio: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question',
  }],
  answers: [{
    type: Schema.Types.ObjectId,
    ref: 'Answer',
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  materials: [{
    type: Schema.Types.ObjectId,
    ref: 'Material',
  }],
  upvotes: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isContentModerator: {
    type: Boolean,
    default: false
  },
  imageFileId: {
    type: String,
    default: ''
  },
  savedPosts: [{
    type: Schema.Types.ObjectId,
    ref: 'Question',
    default: []
  }],
  commonChats:[{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  anonymousSentChats:[{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  anonymousReceivedChats:[{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

export default mongoose.model('User', userSchema);