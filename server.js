// server.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Ajusta esta lista según tus dominios válidos
const allowedOrigins = [
  `http://localhost:${process.env.PORT || 3000}`,
  'https://roddox.es',
];

app.use(cors({
  origin: function (origin, cb) {
    // permitir herramientas sin origin (curl, tests) y orígenes permitidos
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Origen no permitido por CORS'));
  }
}));

// Seguridad básica de cabeceras
app.disable('x-powered-by');

// Servir estáticos (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para enviar la config de Firebase
app.get('/firebase-config', (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor listo en http://localhost:${PORT}`);
});
