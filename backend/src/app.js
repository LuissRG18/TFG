require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const authRoutes      = require('./routes/authRoutes');
const articulosRoutes = require('./routes/articulosRoutes');
const favoritosRoutes = require('./routes/favoritosRoutes');
const usuariosRoutes  = require('./routes/usuariosRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Seguridad ────────────────────────────────
app.use(helmet());

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((s) => s.trim())
  : ['http://localhost:5173', 'http://localhost:4173'];

// Allow all Vercel preview/deployment URLs for this project
const vercelPreviewRegex = /^https:\/\/frontend(-[a-z0-9]+)*-luis-projects-dc2ad089\.vercel\.app$/;

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    if (vercelPreviewRegex.test(origin)) return cb(null, true);
    cb(null, false);
  },
  credentials: true,
}));

// Rate limiting — general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false, // necesario en entornos serverless (sin store distribuido)
  message: { ok: false, mensaje: 'Demasiadas peticiones. Inténtalo más tarde.' },
});

// Rate limiting — auth routes (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  message: { ok: false, mensaje: 'Demasiados intentos de autenticación. Inténtalo en 15 minutos.' },
});

app.use(generalLimiter);

// ── Middlewares ──────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(require('path').join(__dirname, '../public')));

// ── Ruta de diagnóstico (sin DB, para verificar que la función arranca) ──────
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, env: !!process.env.MONGODB_URI, node: process.version });
});

// ── Conexión DB (serverless-safe) ────────────
// Se coloca antes de las rutas para garantizar que MongoDB esté listo.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error:', err.message);
    res.status(500).json({ ok: false, mensaje: 'Error de conexión a la base de datos.' });
  }
});

// ── Rutas ────────────────────────────────────
app.use('/api/auth',       authLimiter, authRoutes);
app.use('/api/articulos',  articulosRoutes);
app.use('/api/favoritos',  favoritosRoutes);
app.use('/api/usuarios',   usuariosRoutes);

// ── Health check ─────────────────────────────
app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: '🚀 CienciaAbierta API', version: '1.0.0', docs: '/api/health' });
});

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    mensaje: '🚀 CienciaAbierta API funcionando correctamente',
    version: '1.0.0',
    rutas: [
      'POST   /api/auth/registro',
      'POST   /api/auth/login',
      'GET    /api/auth/perfil',
      'PUT    /api/auth/perfil',
      'PUT    /api/auth/cambiar-password',
      'GET    /api/articulos/arxiv/buscar?q=...',
      'GET    /api/articulos/semantic/buscar?q=...',
      'GET    /api/articulos/semantic/:paperId',
      'GET    /api/articulos/crossref/buscar?q=...',
      'GET    /api/articulos/estadisticas  (privado)',
      'GET    /api/favoritos               (privado)',
      'POST   /api/favoritos               (privado)',
      'PUT    /api/favoritos/:id           (privado)',
      'DELETE /api/favoritos/:id           (privado)',
      'GET    /api/favoritos/check/:id     (privado)',
      'GET    /api/usuarios                (admin)',
    ],
  });
});

// ── 404 ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada.' });
});

// ── Error handler global ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ ok: false, mensaje: err.message, stack: err.stack });
});

// ── Arranque local cuando se ejecuta directamente (npm run dev / npm start) ──
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📡 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  });
}

// Exportar la app para Vercel (función serverless)
module.exports = app;

