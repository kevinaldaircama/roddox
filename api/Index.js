import express from "express";
import cors from "cors";
import { db, rtdb } from "./firebaseAdmin.js";
import { verifyFirebaseToken } from "./authMiddleware.js";

const app = express();
app.use(cors());
app.use(express.json());

// Salud
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Ejemplo 1: Guardar movimiento en Firestore (colección 'movimientos')
app.post("/api/movimientos", verifyFirebaseToken, async (req, res) => {
  try {
    const { tipo, monto, descripcion } = req.body;
    const data = {
      uid: req.user.uid,
      tipo,
      monto,
      descripcion: descripcion || "",
      createdAt: new Date().toISOString()
    };
    const doc = await db.collection("movimientos").add(data);
    res.json({ id: doc.id, ...data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Ejemplo 2: Descontar créditos en Realtime Database
// Ruta esperada en tu proyecto: usuarios/{ID}/comisionesTotales
app.post("/api/descontar-creditos", verifyFirebaseToken, async (req, res) => {
  try {
    const { usuarioId, cantidad } = req.body; // cantidad positiva
    if (!usuarioId || !cantidad) {
      return res.status(400).json({ error: "usuarioId y cantidad son requeridos" });
    }
    const ref = rtdb.ref(`usuarios/${usuarioId}/comisionesTotales`);
    const snap = await ref.get();
    const actual = Number(snap.val() || 0);
    const nuevo = actual - Number(cantidad);
    if (nuevo < 0) {
      return res.status(400).json({ error: "Créditos insuficientes" });
    }
    await ref.set(nuevo);
    res.json({ anterior: actual, nuevo });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Puerto local (Vercel ignora esto y gestiona serverless automáticamente si usas /api/*)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API running on", PORT));
