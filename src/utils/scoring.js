
export const FAST_ANSWER_THRESHOLD_SECONDS = 15;

export function calculateSolvedScore({
  timeTakenSeconds = 0,
  hintsUsed = 0,
  wasCipherHidden = false,
  identifiedCipherCorrectly = false,
}) {
  let totalDelta = 100;
  const breakdown = [{ label: 'Decoded Transmission', points: 100 }];

  if (wasCipherHidden && identifiedCipherCorrectly) {
    totalDelta += 50;
    breakdown.push({ label: 'Identified Cipher (+50)', points: 50 });
  }

  if (timeTakenSeconds <= FAST_ANSWER_THRESHOLD_SECONDS) {
    totalDelta += 25;
    breakdown.push({ label: 'Fast Decryption Bonus (<15s)', points: 25 });
  }

  if (hintsUsed === 0) {
    totalDelta += 25;
    breakdown.push({ label: 'Pure Cryptanalysis (No Hints)', points: 25 });
  }

  return {
    totalDelta,
    breakdown,
  };
}

export function calculateWrongAnswerPenalty() {
  return {
    delta: -10,
    label: 'Incorrect Decryption (-10)',
  };
}

export function calculateHintPenalty() {
  return {
    delta: -20,
    label: 'Signal Intelligence Hint (-20)',
  };
}
