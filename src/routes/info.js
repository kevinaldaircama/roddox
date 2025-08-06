import { Router } from 'express';
import { db } from '../lib/firebase.js';
const router = Router();

router.get('/', async (req, res) => {
  try {
    const { dni, apaterno, amaterno, nombres } = req.query;
    let q = null;
    if (dni) q = db.collection('info').where('dni', '==', String(dni));
    else if (apaterno) q = db.collection('info').where('apellido_paterno', '==', String(apaterno));
    else if (amaterno) q = db.collection('info').where('apellido_materno', '==', String(amaterno));
    else if (nombres) q = db.collection('info').where('nombres', '==', String(nombres));
    else return res.status(400).json({ ok:false, error: 'Debes enviar al menos un parámetro' });

    const snap = await q.limit(20).get();
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ ok:true, data: items });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error: 'Error interno' });
  }
});

export default router;
