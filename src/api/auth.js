import client from './client';

export async function login({ email, senha }) {
  const { data } = await client.post('/auth/login', { email, senha });
  return data;
}

export async function register({ nome, email, senha }) {
  const { data } = await client.post('/auth/register', { nome, email, senha });
  return data;
}

export async function me() {
  const { data } = await client.get('/auth/me');
  return data;
}
