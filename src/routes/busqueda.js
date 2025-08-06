import { Router } from 'express';
import { db } from '../lib/firebase.js';
const router = Router();

router.post('/', async (req, res) => {
  try {
    const { tipo, valor, usuarioId } = req.body;
    if (!tipo || !valor) return res.status(400).json({ ok:false, error: 'tipo y valor son requeridos' });
    const payload = { tipo, valor, usuarioId: usuarioId || null, creadoEn: new Date() };
    await db.collection('consulta').add(payload);
    res.json({ ok:true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error: 'Error interno' });
  }
});

export default router;
