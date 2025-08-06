import { Router } from 'express';
import { db } from '../lib/firebase.js';
const router = Router();

router.get('/:dni', async (req, res) => {
  try {
    const { dni } = req.params;
    const snap = await db.collection('sis').where('NumeroDocumento', '==', String(dni)).limit(1).get();
    if (snap.empty) return res.json({ ok:true, data: null });
    const doc = snap.docs[0];
    res.json({ ok:true, data: { id: doc.id, ...doc.data() } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error: 'Error interno' });
  }
});

export default router;
