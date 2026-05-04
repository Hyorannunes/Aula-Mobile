import { randomUUID } from 'node:crypto';

/** @type {Map<string, { id: string, email: string, nome: string, passwordHash: string }>} */
const usersById = new Map();
/** @type {Map<string, string>} */
const userIdByEmail = new Map();

/** @type {Map<string, Array<{ id: string, value: string, purpose: string, createdAt: string }>>} */
const passwordEntriesByUserId = new Map();

export function findUserByEmail(email) {
  const id = userIdByEmail.get(String(email).toLowerCase());
  if (!id) return null;
  return usersById.get(id) ?? null;
}

export function createUser({ nome, email, passwordHash }) {
  const normalized = String(email).toLowerCase();
  if (userIdByEmail.has(normalized)) return null;
  const id = randomUUID();
  const user = { id, email: normalized, nome: String(nome).trim(), passwordHash };
  usersById.set(id, user);
  userIdByEmail.set(normalized, id);
  passwordEntriesByUserId.set(id, []);
  return { id, email: user.email, nome: user.nome };
}

export function getUserById(id) {
  const u = usersById.get(id);
  if (!u) return null;
  return { id: u.id, email: u.email, nome: u.nome };
}

export function verifyPasswordForEmail(email, plainPassword) {
  const user = findUserByEmail(email);
  if (!user) return null;
  return { user, ok: true };
}

export function getPasswordHashForUserId(userId) {
  return usersById.get(userId)?.passwordHash ?? null;
}

export function listPasswordEntries(userId) {
  const list = passwordEntriesByUserId.get(userId);
  return list ? [...list] : [];
}

export function addPasswordEntry(userId, { value, purpose }) {
  if (!passwordEntriesByUserId.has(userId)) passwordEntriesByUserId.set(userId, []);
  const entry = {
    id: randomUUID(),
    value: String(value),
    purpose:
      purpose != null && String(purpose).trim() !== '' ? String(purpose).trim() : '—',
    createdAt: new Date().toISOString(),
  };
  passwordEntriesByUserId.get(userId).unshift(entry);
  return entry;
}

export function deletePasswordEntry(userId, entryId) {
  const list = passwordEntriesByUserId.get(userId);
  if (!list) return false;
  const i = list.findIndex((e) => e.id === entryId);
  if (i === -1) return false;
  list.splice(i, 1);
  return true;
}
