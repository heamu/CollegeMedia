import mongoose, { Schema } from "mongoose";

const moderationSchema = new Schema({
  moderators: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  questionsPendingApproval: [{
    type: Schema.Types.ObjectId,
    ref: 'Question',
  }],
  answersPendingApproval: [{
    type: Schema.Types.ObjectId,
    ref: 'Answer',
  }],
}, { timestamps: true });

export default mongoose.model('ModerationQueue', moderationSchema);
