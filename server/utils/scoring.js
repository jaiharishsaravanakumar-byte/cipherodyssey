
export const FAST_ANSWER_THRESHOLD_SECONDS = 15;

export function calculateScore({
  isCorrect = false,
  identifiedCipherCorrectly = false,
  wasCipherHidden = false,
  hintsUsed = 0,
  timeTakenSec = 0,
}) {
  if (!isCorrect) {
    return {
      pointsAwarded: -10,
      breakdown: [{ label: 'Incorrect Decryption Attempt', points: -10 }],
    };
  }

  let totalPoints = 100;
  const breakdown = [{ label: 'Decoded Transmission', points: 100 }];

  if (wasCipherHidden && identifiedCipherCorrectly) {
    totalPoints += 50;
    breakdown.push({ label: 'Identified Obscured Cipher (+50)', points: 50 });
  }

  if (timeTakenSec <= FAST_ANSWER_THRESHOLD_SECONDS) {
    totalPoints += 25;
    breakdown.push({ label: 'Fast Decryption Bonus (<15s)', points: 25 });
  }

  if (hintsUsed === 0) {
    totalPoints += 25;
    breakdown.push({ label: 'Pure Cryptanalysis (No Hints)', points: 25 });
  }

  if (hintsUsed > 0) {
    const hintPenalty = hintsUsed * -20;
    totalPoints += hintPenalty;
    breakdown.push({ label: `Signal Hints Used (${hintsUsed} × -20)`, points: hintPenalty });
  }

  return {
    pointsAwarded: totalPoints,
    breakdown,
  };
}
