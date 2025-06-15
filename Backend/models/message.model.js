import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  text: {
    type: String,
    default: ''
  },
  imageURL: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['anon_sent', 'common', 'anon_received'],
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
