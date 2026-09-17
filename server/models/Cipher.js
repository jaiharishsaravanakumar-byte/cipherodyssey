import mongoose from 'mongoose';

const cipherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true },
    difficultyTier: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    description: { type: String, required: true },
    encryptionMethod: { type: String, default: '' },
    decryptionMethod: { type: String, default: '' },
    prerequisites: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Cipher', cipherSchema);
