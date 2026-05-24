import mongoose from 'mongoose';
const conversationSchema = new mongoose.Schema({
  title:    { type: String, default: 'New Conversation' },
  provider: { type: String, enum: ['gemini', 'openai'], default: 'gemini' },
}, { timestamps: true });
export default mongoose.model('Conversation', conversationSchema);
