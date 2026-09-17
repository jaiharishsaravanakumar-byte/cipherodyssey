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
} from '../src/utils/cipherHelpers.js';

test('1. Caesar Cipher round-trip', () => {
  const inputs = ['HELLO WORLD', 'Attack At Dawn!', 'The quick brown fox jumps over 13 lazy dogs.'];
  for (const str of inputs) {
    const encoded = caesarEncode(str, 5);
    const decoded = caesarDecode(encoded, 5);
    assert.equal(decoded, str);
  }
  assert.equal(caesarEncode('ABC', 3), 'DEF');
  assert.equal(caesarDecode('DEF', 3), 'ABC');
});

test('2. Atbash Cipher round-trip', () => {
  const inputs = ['CIPHERQUEST', 'Hello, World 123!', 'ZYXWVUTSRQPONMLKJIHGFEDCBA'];
  for (const str of inputs) {
    const encoded = atbashEncode(str);
    const decoded = atbashDecode(encoded);
    assert.equal(decoded, str);
  }
  assert.equal(atbashEncode('AZ'), 'ZA');
});

test('3. Reverse Cipher round-trip', () => {
  const inputs = ['ANALOG LAB', '1234567890', 'A man a plan a canal Panama'];
  for (const str of inputs) {
    const encoded = reverseEncode(str);
    const decoded = reverseDecode(encoded);
    assert.equal(decoded, str);
  }
});

test('4. ROT13 Cipher round-trip', () => {
  const inputs = ['CLASSICAL CRYPTOGRAPHY', 'Veni Vidi Vici', 'Secret Lab 2026'];
  for (const str of inputs) {
    const encoded = rot13Encode(str);
    const decoded = rot13Decode(encoded);
    assert.equal(decoded, str);
  }
  assert.equal(rot13Encode('HELLO'), 'URYYB');
});

test('5. Affine Cipher round-trip', () => {
  const inputs = ['AFFINE CIPHER TEST', 'Mathematical Cryptography 101', 'Secret message with punctuation!'];
  for (const str of inputs) {
    const encoded = affineEncode(str, 7, 11);
    const decoded = affineDecode(encoded, 7, 11);
    assert.equal(decoded, str);
  }
  assert.equal(affineDecode(affineEncode('HELLO', 5, 8), 5, 8), 'HELLO');
});

test('6. Vigenère Cipher round-trip', () => {
  const inputs = ['DEFEND THE EAST WALL', 'Cryptography Is Art And Science', 'Short', 'A very long message to encode with spaces and punctuation!'];
  for (const str of inputs) {
    const encoded = vigenereEncode(str, 'FORTIFICATION');
    const decoded = vigenereDecode(encoded, 'FORTIFICATION');
    assert.equal(decoded, str);
  }
  assert.equal(vigenereEncode('ATTACKATDAWN', 'LEMON'), 'LXFOPVEFRNHR');
});

test('7. Columnar Transposition Cipher round-trip', () => {
  const inputs = [
    'DEFENDTHEEASTWALL',
    'THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG',
    'EXACT_MULTIPLE_FOUR',
    'RAGGED_INPUT_TEST_CASE',
  ];
  for (const str of inputs) {
    const encoded = columnarEncode(str, 'CIPHER');
    const decoded = columnarDecode(encoded, 'CIPHER');
    assert.equal(decoded, str);
  }
});

test('8. Rail Fence Cipher round-trip', () => {
  const inputs = [
    'DEFENDTHEEASTWALL',
    'WEAREDISCOVEREDFLEEATONCE',
    'HELLO WORLD WITH SPACES',
    'A SHORT MSG',
  ];
  for (const rails of [2, 3, 4, 5]) {
    for (const str of inputs) {
      const encoded = railFenceEncode(str, rails);
      const decoded = railFenceDecode(encoded, rails);
      assert.equal(decoded, str);
    }
  }
});

test('9. Playfair Cipher round-trip', () => {
  const inputs = ['INSTRUMENTS', 'SECRET TRANSMISSION', 'HIDDEN ARCHIVE'];
  for (const str of inputs) {
    const prepared = preparePlayfairText(str).join('');
    const encoded = playfairEncode(str, 'MONARCHY');
    const decoded = playfairDecode(encoded, 'MONARCHY');
    assert.equal(decoded, prepared);
  }
});

test('10. Bacon Cipher round-trip', () => {
  const inputs = ['CIPHER', 'LABORATORY', 'TOP SECRET MESSAGE'];
  for (const str of inputs) {
    const encoded = baconEncode(str);
    const decoded = baconDecode(encoded);
    assert.equal(decoded, str.replace(/\s+/g, ' '));
  }
});
