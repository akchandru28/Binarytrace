import mongoose from 'mongoose';
const inferenceLogSchema = new mongoose.Schema({
  conversationId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  provider:         { type: String },
  model:            { type: String },
  latency:          { type: Number },
  promptTokens:     { type: Number },
  completionTokens: { type: Number },
  status:           { type: String, enum: ['success', 'error'], default: 'success' },
  error:            { type: String },
  inputPreview:     { type: String },
  outputPreview:    { type: String },
}, { timestamps: true });
export default mongoose.model('InferenceLog', inferenceLogSchema);
