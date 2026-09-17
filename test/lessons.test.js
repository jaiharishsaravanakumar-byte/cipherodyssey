import test from 'node:test';
import assert from 'node:assert';
import { CIPHER_LESSONS } from '../src/data/cipherLessons.js';
import { useAppStore } from '../src/store/useAppStore.js';
import {
  caesarEncode, caesarDecode,
  atbashEncode, atbashDecode,
  reverseEncode, reverseDecode,
  rot13Encode, rot13Decode,
  affineEncode, affineDecode,
  vigenereEncode, vigenereDecode,
  railFenceEncode, railFenceDecode,
  columnarEncode, columnarDecode,
  playfairEncode, playfairDecode,
  baconEncode, baconDecode,
} from '../src/utils/cipherHelpers.js';

const ALL_CIPHER_SLUGS = [
  'caesar', 'atbash', 'reverse', 'rot13', 'affine',
  'vigenere', 'rail-fence', 'columnar', 'playfair', 'bacon',
];

test('1. All 10 ciphers have populated curriculum in CIPHER_LESSONS', () => {
  for (const slug of ALL_CIPHER_SLUGS) {
    const lesson = CIPHER_LESSONS[slug];
    assert.ok(lesson, `Lesson for ${slug} must exist`);
    assert.ok(lesson.title, `Lesson ${slug} must have a title`);
    assert.ok(lesson.concept?.summary, `Lesson ${slug} must have a concept summary`);
    assert.ok(lesson.concept?.mathModel?.encryption, `Lesson ${slug} must have mathModel.encryption`);
    assert.ok(lesson.concept?.vulnerability?.points?.length > 0, `Lesson ${slug} must have vulnerability points`);
    assert.ok(lesson.encryption?.steps?.length > 0, `Lesson ${slug} must have encryption steps`);
    assert.ok(lesson.decryption?.steps?.length > 0, `Lesson ${slug} must have decryption steps`);
    assert.ok(lesson.tryIt?.words?.length > 0, `Lesson ${slug} must have tryIt words`);
  }
});

test('2. Dynamic cipher helpers encode and decode correctly for TryItYourself', () => {
  assert.strictEqual(caesarEncode('VERITAS', 3), 'YHULWDV');
  assert.strictEqual(caesarDecode('YHULWDV', 3), 'VERITAS');

  assert.strictEqual(atbashEncode('WISDOM'), 'DRHWLN');
  assert.strictEqual(atbashDecode('DRHWLN'), 'WISDOM');

  assert.strictEqual(reverseEncode('CIPHER'), 'REHPIC');
  assert.strictEqual(reverseDecode('REHPIC'), 'CIPHER');

  assert.strictEqual(rot13Encode('SIGNAL'), 'FVTANY');
  assert.strictEqual(rot13Decode('FVTANY'), 'SIGNAL');

  assert.strictEqual(affineEncode('AFFINE', 5, 8), 'IHHWVC');
  assert.strictEqual(affineDecode('IHHWVC', 5, 8), 'AFFINE');

  assert.strictEqual(vigenereEncode('ATTACK', 'LEMON'), 'LXFOPV');
  assert.strictEqual(vigenereDecode('LXFOPV', 'LEMON'), 'ATTACK');

  assert.strictEqual(railFenceEncode('DEFENDTHEWALL', 3), 'DNELEEDHWLFTA');
  assert.strictEqual(railFenceDecode('DNELEEDHWLFTA', 3), 'DEFENDTHEWALL');

  const columnarEnc = columnarEncode('DEFENDTHEWALL', 'ZEBRA');
  assert.strictEqual(columnarDecode(columnarEnc, 'ZEBRA'), 'DEFENDTHEWALL');

  const pfEnc = playfairEncode('HELLO', 'MONARCHY');
  assert.strictEqual(playfairDecode(pfEnc, 'MONARCHY'), 'HELXLO');

  const baconEnc = baconEncode('KEY');
  assert.strictEqual(baconDecode(baconEnc), 'KEY');
});

test('3. Cipher mastery marks cipher as mastered in store', () => {
  const initialMastered = useAppStore.getState().isMastered('affine');
  assert.strictEqual(initialMastered, false);
  useAppStore.getState().masterCipher('affine');
  assert.strictEqual(useAppStore.getState().isMastered('affine'), true);
  assert.ok(useAppStore.getState().masteredCiphers.includes('affine'));
});
