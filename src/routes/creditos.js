import { Router } from 'express';
import { rtdb } from '../lib/firebase.js';
const router = Router();

router.post('/descontar', async (req, res) => {
  try {
    const { usuarioId, cantidad } = req.body;
    if (!usuarioId || typeof cantidad !== 'number') {
      return res.status(400).json({ ok:false, error: 'usuarioId y cantidad son requeridos' });
    }
    const ref = rtdb.ref(`usuarios/${usuarioId}/comisionesTotales`);
    const result = await ref.transaction(current => {
      const curr = Number(current || 0);
      const next = curr - cantidad;
      if (next < 0) return curr;
      return next;
    });
    if (!result.committed) return res.status(409).json({ ok:false, error: 'Saldo insuficiente o no se pudo actualizar' });
    res.json({ ok:true, nuevoSaldo: result.snapshot.val() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error: 'Error interno' });
  }
});

export default router;
