import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: 'New Conversation',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);