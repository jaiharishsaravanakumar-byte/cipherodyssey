

const API_BASE = 'http://localhost:5000/api';


export function getOrCreateUserId() {
  if (typeof window === 'undefined') return 'server_agent';

  const STORAGE_KEY = 'cq_agent_id';
  let userId = localStorage.getItem(STORAGE_KEY);

  if (!userId) {
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    userId = `agent_${Date.now().toString(36)}_${randomSuffix}`;
    try {
      localStorage.setItem(STORAGE_KEY, userId);
    } catch {
      
    }
  }

  return userId;
}

export async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || `HTTP error ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  return response.json();
}
