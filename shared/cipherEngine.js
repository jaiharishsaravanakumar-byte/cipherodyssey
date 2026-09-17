

  
export function caesarEncode(text, shift = 3) {
  const s = ((shift % 26) + 26) % 26;
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + s) % 26) + 65);
      }
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + s) % 26) + 97);
      }
      return char;
    })
    .join('');
}

export function caesarDecode(text, shift = 3) {
  return caesarEncode(text, 26 - (((shift % 26) + 26) % 26));
}


export function atbashEncode(text) {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(90 - (code - 65));
      }
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(122 - (code - 97));
      }
      return char;
    })
    .join('');
}

export function atbashDecode(text) {
  return atbashEncode(text);
}



export function reverseEncode(text) {
  return text.split('').reverse().join('');
}

export function reverseDecode(text) {
  return reverseEncode(text);
}


export function rot13Encode(text) {
  return caesarEncode(text, 13);
}

export function rot13Decode(text) {
  return caesarEncode(text, 13);
}


function modInverse(a, m = 26) {
  a = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  return null;
}

export function affineEncode(text, a = 5, b = 8) {
  const aNorm = ((a % 26) + 26) % 26;
  const bNorm = ((b % 26) + 26) % 26;
  if (modInverse(aNorm, 26) === null) {
    throw new Error(`Key 'a' (${a}) must be coprime to 26.`);
  }

  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        const x = code - 65;
        return String.fromCharCode(((aNorm * x + bNorm) % 26) + 65);
      }
      if (code >= 97 && code <= 122) {
        const x = code - 97;
        return String.fromCharCode(((aNorm * x + bNorm) % 26) + 97);
      }
      return char;
    })
    .join('');
}

export function affineDecode(text, a = 5, b = 8) {
  const aNorm = ((a % 26) + 26) % 26;
  const bNorm = ((b % 26) + 26) % 26;
  const aInv = modInverse(aNorm, 26);
  if (aInv === null) {
    throw new Error(`Key 'a' (${a}) must be coprime to 26.`);
  }

  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        const y = code - 65;
        const x = (((aInv * (y - bNorm)) % 26) + 26) % 26;
        return String.fromCharCode(x + 65);
      }
      if (code >= 97 && code <= 122) {
        const y = code - 97;
        const x = (((aInv * (y - bNorm)) % 26) + 26) % 26;
        return String.fromCharCode(x + 97);
      }
      return char;
    })
    .join('');
}



export function vigenereEncode(text, key = 'CIPHER') {
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!cleanKey) return text;

  let keyIndex = 0;
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;

      if (code >= 65 && code <= 90) {
        keyIndex++;
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      }
      if (code >= 97 && code <= 122) {
        keyIndex++;
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
      return char;
    })
    .join('');
}

export function vigenereDecode(text, key = 'CIPHER') {
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!cleanKey) return text;

  let keyIndex = 0;
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;

      if (code >= 65 && code <= 90) {
        keyIndex++;
        return String.fromCharCode((((code - 65 - shift) % 26) + 26) % 26 + 65);
      }
      if (code >= 97 && code <= 122) {
        keyIndex++;
        return String.fromCharCode((((code - 97 - shift) % 26) + 26) % 26 + 97);
      }
      return char;
    })
    .join('');
}



function getKeyColumnOrder(key) {
  const keyChars = key.toUpperCase().split('').map((char, index) => ({ char, index }));
  keyChars.sort((a, b) => {
    if (a.char < b.char) return -1;
    if (a.char > b.char) return 1;
    return a.index - b.index;
  });
  return keyChars.map((item) => item.index);
}

export function columnarEncode(text, key = 'SECRET') {
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!cleanKey || cleanKey.length === 1 || !text) return text;

  const numCols = cleanKey.length;
  const numRows = Math.ceil(text.length / numCols);
  const order = getKeyColumnOrder(cleanKey);

  let result = '';
  for (const colIdx of order) {
    for (let r = 0; r < numRows; r++) {
      const charIdx = r * numCols + colIdx;
      if (charIdx < text.length) {
        result += text[charIdx];
      }
    }
  }
  return result;
}

export function columnarDecode(text, key = 'SECRET') {
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!cleanKey || cleanKey.length === 1 || !text) return text;

  const numCols = cleanKey.length;
  const numRows = Math.ceil(text.length / numCols);
  const remainder = text.length % numCols;
  const order = getKeyColumnOrder(cleanKey);

  const colLengths = new Array(numCols).fill(0);
  for (let c = 0; c < numCols; c++) {
    colLengths[c] = remainder === 0 || c < remainder ? numRows : numRows - 1;
  }

  const columns = new Array(numCols);
  let readPtr = 0;
  for (const colIdx of order) {
    const len = colLengths[colIdx];
    columns[colIdx] = text.slice(readPtr, readPtr + len).split('');
    readPtr += len;
  }

  let result = '';
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (columns[c] && columns[c].length > 0) {
        result += columns[c].shift();
      }
    }
  }
  return result;
}



export function railFenceEncode(text, rails = 3) {
  const r = Math.max(2, Math.floor(rails));
  if (!text || text.length <= r) return text;

  const fence = Array.from({ length: r }, () => []);
  let rail = 0;
  let direction = 1;

  for (let i = 0; i < text.length; i++) {
    fence[rail].push(text[i]);
    rail += direction;
    if (rail === r - 1 || rail === 0) {
      direction = -direction;
    }
  }

  return fence.map((row) => row.join('')).join('');
}

export function railFenceDecode(text, rails = 3) {
  const r = Math.max(2, Math.floor(rails));
  if (!text || text.length <= r) return text;

  const railLengths = new Array(r).fill(0);
  let rail = 0;
  let direction = 1;
  for (let i = 0; i < text.length; i++) {
    railLengths[rail]++;
    rail += direction;
    if (rail === r - 1 || rail === 0) {
      direction = -direction;
    }
  }

  const fence = [];
  let readPtr = 0;
  for (let i = 0; i < r; i++) {
    fence.push(text.slice(readPtr, readPtr + railLengths[i]).split(''));
    readPtr += railLengths[i];
  }

  let result = '';
  rail = 0;
  direction = 1;
  for (let i = 0; i < text.length; i++) {
    result += fence[rail].shift();
    rail += direction;
    if (rail === r - 1 || rail === 0) {
      direction = -direction;
    }
  }

  return result;
}



export function generatePlayfairMatrix(key = 'MONARCHY') {
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
  const seen = new Set();
  const matrix = [];

  for (const char of cleanKey) {
    if (!seen.has(char)) {
      seen.add(char);
      matrix.push(char);
    }
  }

  const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
  for (const char of alphabet) {
    if (!seen.has(char)) {
      seen.add(char);
      matrix.push(char);
    }
  }

  return matrix;
}

export function preparePlayfairText(text) {
  const clean = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
  const digraphs = [];
  let i = 0;

  while (i < clean.length) {
    const a = clean[i];
    const b = clean[i + 1];

    if (b === undefined) {
      digraphs.push(a + 'X');
      i++;
    } else if (a === b) {
      digraphs.push(a + 'X');
      i++;
    } else {
      digraphs.push(a + b);
      i += 2;
    }
  }
  return digraphs;
}

export function playfairEncode(text, key = 'MONARCHY') {
  const matrix = generatePlayfairMatrix(key);
  const digraphs = preparePlayfairText(text);

  return digraphs
    .map((pair) => {
      const idxA = matrix.indexOf(pair[0]);
      const idxB = matrix.indexOf(pair[1]);

      const rA = Math.floor(idxA / 5);
      const cA = idxA % 5;
      const rB = Math.floor(idxB / 5);
      const cB = idxB % 5;

      if (rA === rB) {
        return matrix[rA * 5 + ((cA + 1) % 5)] + matrix[rB * 5 + ((cB + 1) % 5)];
      } else if (cA === cB) {
        return matrix[((rA + 1) % 5) * 5 + cA] + matrix[((rB + 1) % 5) * 5 + cB];
      } else {
        return matrix[rA * 5 + cB] + matrix[rB * 5 + cA];
      }
    })
    .join('');
}

export function playfairDecode(ciphertext, key = 'MONARCHY') {
  const matrix = generatePlayfairMatrix(key);
  const clean = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
  const pairs = [];
  for (let i = 0; i < clean.length; i += 2) {
    pairs.push(clean.slice(i, i + 2));
  }

  return pairs
    .map((pair) => {
      const idxA = matrix.indexOf(pair[0]);
      const idxB = matrix.indexOf(pair[1]);
      if (idxA === -1 || idxB === -1) return pair;

      const rA = Math.floor(idxA / 5);
      const cA = idxA % 5;
      const rB = Math.floor(idxB / 5);
      const cB = idxB % 5;

      if (rA === rB) {
        return matrix[rA * 5 + ((cA + 4) % 5)] + matrix[rB * 5 + ((cB + 4) % 5)];
      } else if (cA === cB) {
        return matrix[((rA + 4) % 5) * 5 + cA] + matrix[((rB + 4) % 5) * 5 + cB];
      } else {
        return matrix[rA * 5 + cB] + matrix[rB * 5 + cA];
      }
    })
    .join('');
}

const BACON_MAP = {
  A: 'AAAAA', B: 'AAAAB', C: 'AAABA', D: 'AAABB', E: 'AABAA',
  F: 'AABAB', G: 'AABBA', H: 'AABBB', I: 'ABAAA', J: 'ABAAB',
  K: 'ABABA', L: 'ABABB', M: 'ABBAA', N: 'ABBAB', O: 'ABBBA',
  P: 'ABBBB', Q: 'BAAAA', R: 'BAAAB', S: 'BAABA', T: 'BAABB',
  U: 'BABAA', V: 'BABAB', W: 'BABBA', X: 'BABBB', Y: 'BBAAA',
  Z: 'BBAAB',
};

const BACON_REVERSE = Object.fromEntries(
  Object.entries(BACON_MAP).map(([k, v]) => [v, k])
);

export function baconEncode(text) {
  return text
    .toUpperCase()
    .split('')
    .map((char) => {
      if (BACON_MAP[char]) {
        return BACON_MAP[char];
      }
      if (char === ' ') {
        return '/';
      }
      return char;
    })
    .join(' ');
}

export function baconDecode(ciphertext) {
  const tokens = ciphertext.trim().split(/\s+/);
  return tokens
    .map((token) => {
      const upper = token.toUpperCase();
      if (upper === '/') return ' ';
      if (BACON_REVERSE[upper]) {
        return BACON_REVERSE[upper];
      }
      return token;
    })
    .join('');
}
