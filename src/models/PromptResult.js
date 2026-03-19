import mongoose from 'mongoose';

const promptResultSchema = new mongoose.Schema({
  prompt: String,
  resposta: String,
}, { timestamps: true });

export default mongoose.model('PromptResult', promptResultSchema);