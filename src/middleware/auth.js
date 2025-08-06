export function apiKeyAuth(req, res, next) {
  const headerKey = req.header('x-api-key');
  const validKey = process.env.API_KEY;
  if (!validKey || headerKey !== validKey) {
    return res.status(401).json({ ok: false, error: 'No autorizado' });
  }
  next();
}
