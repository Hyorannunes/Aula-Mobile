import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { addPasswordEntry, deletePasswordEntry, listPasswordEntries } from '../store.js';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  res.json({ items: listPasswordEntries(req.userId) });
});

router.post('/', (req, res) => {
  const { value, purpose } = req.body ?? {};
  if (!value || String(value).trim() === '') {
    res.status(400).json({ error: 'value (senha) é obrigatório' });
    return;
  }
  const entry = addPasswordEntry(req.userId, { value, purpose });
  res.status(201).json({ entry });
});

router.delete('/:id', (req, res) => {
  const ok = deletePasswordEntry(req.userId, req.params.id);
  if (!ok) {
    res.status(404).json({ error: 'Registro não encontrado' });
    return;
  }
  res.status(204).send();
});

export default router;
