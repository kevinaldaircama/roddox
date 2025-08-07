const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const app = express();
const PORT = 8080;
const API_KEY = "superclave12345";

const credenciales = require("./credenciales.json");

admin.initializeApp({
  credential: admin.credential.cert(credenciales)
});

const db = admin.firestore();
app.use(cors());

app.use((req, res, next) => {
  if (req.headers["x-api-key"] !== API_KEY) {
    return res.status(401).json({ ok: false, error: "No autorizado" });
  }
  next();
});

const rutas = {
  telefono: { coleccion: "telefonos", campo: "telefonos" },
  sis: { coleccion: "sis", campo: "dni" },
  delitos: { coleccion: "descargas", campo: "dni" },
  personas: { coleccion: "personas", campo: "dni" },
  info: { coleccion: "info", campo: "dni" },
  busqueda: { coleccion: "busqueda", campo: "dni" }
};

Object.entries(rutas).forEach(([ruta, { coleccion, campo }]) => {
  app.get(`/${ruta}`, async (req, res) => {
    const valor = req.query[campo];
    if (!valor) return res.status(400).json({ ok: false, error: "Falta el parámetro" });

    try {
      const snapshot = await db.collection(coleccion).where(campo, "==", valor).get();
      if (snapshot.empty) return res.status(404).json({ ok: false, error: "No encontrado" });

      const resultados = [];
      snapshot.forEach(doc => resultados.push({ id: doc.id, ...doc.data() }));
      res.json({ ok: true, data: resultados });
    } catch (err) {
      res.status(500).json({ ok: false, error: "Error interno", details: err.message });
    }
  });
});

app.listen(PORT, () => {
  console.log(`🔥 API corriendo en el puerto ${PORT}`);
});
