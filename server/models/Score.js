import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    cipherType: { type: String, required: true },
    correct: { type: Boolean, required: true },
    cipherIdCorrect: { type: Boolean, default: false },
    score: { type: Number, required: true },
    timeTakenSec: { type: Number, default: 0 },
    hintsUsed: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Score', scoreSchema);
