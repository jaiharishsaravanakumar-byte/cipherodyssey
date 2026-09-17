import { request } from './client.js';

export async function fetchCiphers() {
  const result = await request('/ciphers');
  return result.data || [];
}

export async function fetchCipherBySlug(slug) {
  const result = await request(`/ciphers/${encodeURIComponent(slug)}`);
  return result.data;
}
