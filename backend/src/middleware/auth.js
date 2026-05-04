import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Token ausente' });
    return;
  }
  try {
    const secret = process.env.JWT_SECRET || 'dev-secret-altere-em-producao';
    const payload = jwt.verify(token, secret);
    const userId = payload.sub;
    if (!userId || typeof userId !== 'string') {
      res.status(401).json({ error: 'Token inválido' });
      return;
    }
    req.userId = userId;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}
