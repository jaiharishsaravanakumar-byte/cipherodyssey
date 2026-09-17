import { request, getOrCreateUserId } from './client.js';

export async function postScore(scoreData) {
  const userId = scoreData.userId || getOrCreateUserId();
  return request('/scores', {
    method: 'POST',
    body: JSON.stringify({
      ...scoreData,
      userId,
    }),
  });
}

export async function fetchScoreSummary(customUserId) {
  const userId = customUserId || getOrCreateUserId();
  const result = await request(`/scores/summary?userId=${encodeURIComponent(userId)}`);
  return result.summary;
}

export async function fetchAchievements(customUserId) {
  const userId = customUserId || getOrCreateUserId();
  const result = await request(`/achievements?userId=${encodeURIComponent(userId)}`);
  return result.achievements;
}
