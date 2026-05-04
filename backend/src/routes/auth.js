import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  createUser,
  findUserByEmail,
  getPasswordHashForUserId,
  getUserById,
} from '../store.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

function signToken(userId) {
  const secret = process.env.JWT_SECRET || 'dev-secret-altere-em-producao';
  return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body ?? {};
  if (!nome || !email || !senha) {
    res.status(400).json({ error: 'nome, email e senha são obrigatórios' });
    return;
  }
  if (String(senha).length < 4) {
    res.status(400).json({ error: 'Senha muito curta' });
    return;
  }
  if (findUserByEmail(email)) {
    res.status(409).json({ error: 'Email já cadastrado' });
    return;
  }
  const passwordHash = await bcrypt.hash(String(senha), 10);
  const user = createUser({ nome, email, passwordHash });
  if (!user) {
    res.status(409).json({ error: 'Não foi possível criar o usuário' });
    return;
  }
  const token = signToken(user.id);
  res.status(201).json({ token, user });
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body ?? {};
  if (!email || !senha) {
    res.status(400).json({ error: 'email e senha são obrigatórios' });
    return;
  }
  const existing = findUserByEmail(email);
  if (!existing) {
    res.status(401).json({ error: 'Email ou senha incorretos' });
    return;
  }
  const hash = getPasswordHashForUserId(existing.id);
  const ok = hash && (await bcrypt.compare(String(senha), hash));
  if (!ok) {
    res.status(401).json({ error: 'Email ou senha incorretos' });
    return;
  }
  const token = signToken(existing.id);
  const user = getUserById(existing.id);
  res.json({ token, user });
});

router.get('/me', authMiddleware, (req, res) => {
  const user = getUserById(req.userId);
  if (!user) {
    res.status(401).json({ error: 'Usuário não encontrado' });
    return;
  }
  res.json({ user });
});

export default router;
