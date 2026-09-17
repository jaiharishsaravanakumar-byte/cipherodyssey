import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    cipherType: { type: String, required: true, index: true },
    plaintext: { type: String, required: true },
    ciphertext: { type: String, required: true },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'hard'],
      index: true,
    },
    cipherRevealed: { type: Boolean, default: true },
    params: { type: mongoose.Schema.Types.Mixed, default: {} },
    points: { type: Number, default: 100 },
    hints: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Challenge', challengeSchema);
