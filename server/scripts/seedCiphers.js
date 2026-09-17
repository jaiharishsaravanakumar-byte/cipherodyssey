import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Cipher from '../models/Cipher.js';
import Challenge from '../models/Challenge.js';
import Score from '../models/Score.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cipherodyssey';

const CIPHERS_SEED_DATA = [
  {
    name: 'Caesar Cipher',
    slug: 'caesar',
    category: 'Monoalphabetic Substitution',
    difficultyTier: 'Beginner',
    description: 'Shifts each letter by a fixed integer across the alphabet.',
    encryptionMethod: 'E(x) = (x + k) mod 26',
    decryptionMethod: 'D(y) = (y - k + 26) mod 26',
    prerequisites: [],
  },
  {
    name: 'Atbash Cipher',
    slug: 'atbash',
    category: 'Monoalphabetic Substitution',
    difficultyTier: 'Beginner',
    description: 'Inverts the alphabet symmetrically so A swaps with Z and B with Y.',
    encryptionMethod: 'E(x) = (25 - x)',
    decryptionMethod: 'D(y) = (25 - y)',
    prerequisites: [],
  },
  {
    name: 'Reverse Cipher',
    slug: 'reverse',
    category: 'Transposition',
    difficultyTier: 'Beginner',
    description: 'Inverts character sequence backwards, laying the groundwork for transposition.',
    encryptionMethod: 'Reverses string index: output[i] = input[length - 1 - i]',
    decryptionMethod: 'Reverses string index: output[i] = input[length - 1 - i]',
    prerequisites: [],
  },
  {
    name: 'ROT13',
    slug: 'rot13',
    category: 'Monoalphabetic Substitution',
    difficultyTier: 'Beginner',
    description: 'Caesar with shift 13, creating a purely self-reciprocal transformation.',
    encryptionMethod: 'E(x) = (x + 13) mod 26',
    decryptionMethod: 'D(y) = (y + 13) mod 26',
    prerequisites: ['caesar'],
  },
  {
    name: 'Affine Cipher',
    slug: 'affine',
    category: 'Modular Arithmetic',
    difficultyTier: 'Intermediate',
    description: 'Generalizes Caesar with a linear modular function: E(x) = (ax + b) mod 26.',
    encryptionMethod: 'E(x) = (ax + b) mod 26 (gcd(a, 26) = 1)',
    decryptionMethod: 'D(y) = a^-1 * (y - b) mod 26',
    prerequisites: ['caesar'],
  },
  {
    name: 'Vigenère Cipher',
    slug: 'vigenere',
    category: 'Polyalphabetic Substitution',
    difficultyTier: 'Intermediate',
    description: 'Repeats a keyword to apply variable Caesar shifts across each position.',
    encryptionMethod: 'E(x_i) = (x_i + k_(i mod m)) mod 26',
    decryptionMethod: 'D(y_i) = (y_i - k_(i mod m) + 26) mod 26',
    prerequisites: ['caesar', 'rot13'],
  },
  {
    name: 'Rail Fence Cipher',
    slug: 'rail-fence',
    category: 'Transposition',
    difficultyTier: 'Intermediate',
    description: 'Weaves letters along a zigzag rail path before assembling line by line.',
    encryptionMethod: 'Writes along zigzag fence of depth r, then concatenates rows.',
    decryptionMethod: 'Traces zigzag trajectory to partition and reconstruct plaintext.',
    prerequisites: ['reverse'],
  },
  {
    name: 'Columnar Transposition',
    slug: 'columnar',
    category: 'Transposition',
    difficultyTier: 'Intermediate',
    description: 'Fills a grid row-by-row and unpacks columns in alphabetical key order.',
    encryptionMethod: 'Fills matrix rows, reads out columns in sorted key order.',
    decryptionMethod: 'Calculates ragged column lengths, reassembles rows.',
    prerequisites: ['rail-fence'],
  },
  {
    name: 'Playfair Cipher',
    slug: 'playfair',
    category: 'Digraphic Substitution',
    difficultyTier: 'Advanced',
    description: 'Encrypts letter pairs (digraphs) across a 5×5 keyed grid matrix.',
    encryptionMethod: 'Enciphers digraphs via same row (right), same column (down), or rectangle corners.',
    decryptionMethod: 'Deciphers digraphs via same row (left), same column (up), or rectangle corners.',
    prerequisites: ['vigenere', 'affine'],
  },
  {
    name: "Bacon's Cipher",
    slug: 'bacon',
    category: 'Steganographic Substitution',
    difficultyTier: 'Advanced',
    description: 'Encodes letters into 5-bit binary sequences, hiding secrets in typographic form.',
    encryptionMethod: 'Maps 26 letters into 5-bit permutations of A and B.',
    decryptionMethod: 'Decodes 5-bit clusters back to letters.',
    prerequisites: ['atbash'],
  },
];

async function seedDatabase() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);

    console.log('Clearing existing collections (ciphers, challenges, scores)...');
    await Cipher.deleteMany({});
    await Challenge.deleteMany({});
    await Score.deleteMany({});
    console.log('Cleared all previous data.');

    console.log(`Seeding ${CIPHERS_SEED_DATA.length} canonical ciphers...`);
    const inserted = await Cipher.insertMany(CIPHERS_SEED_DATA);

    console.log(`Successfully seeded ${inserted.length} ciphers:`);
    inserted.forEach((c) => console.log(` - [${c.difficultyTier}] ${c.name} (${c.slug})`));

    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedDatabase();
