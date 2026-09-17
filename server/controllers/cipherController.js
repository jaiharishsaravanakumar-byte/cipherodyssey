import Cipher from '../models/Cipher.js';

export async function getAllCiphers(req, res) {
  try {
    const ciphers = await Cipher.find({}).sort({ difficultyTier: 1, name: 1 });
    return res.json({ success: true, count: ciphers.length, data: ciphers });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getCipherBySlug(req, res) {
  try {
    const { slug } = req.params;
    const cipher = await Cipher.findOne({ slug: slug.toLowerCase() });
    if (!cipher) {
      return res.status(404).json({ success: false, error: `Cipher '${slug}' not found` });
    }
    return res.json({ success: true, data: cipher });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
