import test from 'node:test';
import assert from 'node:assert/strict';

import {
  caesarEncode,
  caesarDecode,
  atbashEncode,
  atbashDecode,
  reverseEncode,
  reverseDecode,
  rot13Encode,
  rot13Decode,
  affineEncode,
  affineDecode,
  vigenereEncode,
  vigenereDecode,
  columnarEncode,
  columnarDecode,
  railFenceEncode,
  railFenceDecode,
  preparePlayfairText,
  playfairEncode,
  playfairDecode,
  baconEncode,
  baconDecode,
} from '../utils/cipherEngine.js';

test('Server Engine: 1. Caesar Cipher round-trip', () => {
  const inputs = ['HELLO WORLD', 'Attack At Dawn!', 'Server Test Vector 123'];
  for (const str of inputs) {
    assert.equal(caesarDecode(caesarEncode(str, 5), 5), str);
  }
});

test('Server Engine: 2. Atbash Cipher round-trip', () => {
  const inputs = ['CIPHERQUEST', 'Hello, World 123!', 'ZYXWVUTSRQPONMLKJIHGFEDCBA'];
  for (const str of inputs) {
    assert.equal(atbashDecode(atbashEncode(str)), str);
  }
});

test('Server Engine: 3. Reverse Cipher round-trip', () => {
  const inputs = ['ANALOG LAB', '1234567890', 'A man a plan a canal Panama'];
  for (const str of inputs) {
    assert.equal(reverseDecode(reverseEncode(str)), str);
  }
});

test('Server Engine: 4. ROT13 Cipher round-trip', () => {
  const inputs = ['CLASSICAL CRYPTOGRAPHY', 'Veni Vidi Vici', 'Secret Lab 2026'];
  for (const str of inputs) {
    assert.equal(rot13Decode(rot13Encode(str)), str);
  }
});

test('Server Engine: 5. Affine Cipher round-trip', () => {
  const inputs = ['AFFINE CIPHER TEST', 'Mathematical Cryptography 101', 'Secret message!'];
  for (const str of inputs) {
    assert.equal(affineDecode(affineEncode(str, 7, 11), 7, 11), str);
  }
});

test('Server Engine: 6. Vigenère Cipher round-trip', () => {
  const inputs = ['DEFEND THE EAST WALL', 'Cryptography Is Art', 'Short message!'];
  for (const str of inputs) {
    assert.equal(vigenereDecode(vigenereEncode(str, 'SECRET'), 'SECRET'), str);
  }
});

test('Server Engine: 7. Columnar Transposition Cipher round-trip', () => {
  const inputs = ['DEFENDTHEEASTWALL', 'THEQUICKBROWNFOXJUMPS', 'RAGGED_INPUT_TEST'];
  for (const str of inputs) {
    assert.equal(columnarDecode(columnarEncode(str, 'CIPHER'), 'CIPHER'), str);
  }
});

test('Server Engine: 8. Rail Fence Cipher round-trip', () => {
  const inputs = ['DEFENDTHEEASTWALL', 'WEAREDISCOVEREDFLEEATONCE', 'TEST RAIL FENCE'];
  for (const r of [2, 3, 4]) {
    for (const str of inputs) {
      assert.equal(railFenceDecode(railFenceEncode(str, r), r), str);
    }
  }
});

test('Server Engine: 9. Playfair Cipher round-trip', () => {
  const inputs = ['INSTRUMENTS', 'SECRET TRANSMISSION', 'HIDDEN ARCHIVE'];
  for (const str of inputs) {
    const prepared = preparePlayfairText(str).join('');
    assert.equal(playfairDecode(playfairEncode(str, 'MONARCHY'), 'MONARCHY'), prepared);
  }
});

test('Server Engine: 10. Bacon Cipher round-trip', () => {
  const inputs = ['CIPHER', 'LABORATORY', 'TOP SECRET MESSAGE'];
  for (const str of inputs) {
    assert.equal(baconDecode(baconEncode(str)), str);
  }
});
