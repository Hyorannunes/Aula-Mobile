import client from './client';

export async function list() {
  const { data } = await client.get('/password-entries');
  return data.items ?? [];
}

export async function create({ value, purpose }) {
  const { data } = await client.post('/password-entries', { value, purpose });
  return data.entry;
}

export async function remove(id) {
  await client.delete(`/password-entries/${encodeURIComponent(id)}`);
}
