import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import './lib/firebase.js';
import { apiKeyAuth } from './middleware/auth.js';

import health from './routes/health.js';
import telefonos from './routes/telefonos.js';
import sis from './routes/sis.js';
import info from './routes/info.js';
import descargas from './routes/descargas.js';
import creditos from './routes/creditos.js';
import busqueda from './routes/busqueda.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
app.use(limiter);

// Ruta pública
app.use('/health', health);

// Rutas protegidas por API Key
app.use(apiKeyAuth);
app.use('/telefonos', telefonos);
app.use('/sis', sis);
app.use('/info', info);
app.use('/descargas', descargas);
app.use('/creditos', creditos);
app.use('/busqueda', busqueda);

app.get('/', (req, res) => res.json({ ok: true, name: 'firebase-api-kevin', version: '1.0.0' }));

export default app;
