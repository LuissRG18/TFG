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

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (e.g. curl, Postman) and whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origen no permitido → ${origin}`));
  },
  credentials: true,
}));

// Rate limiting — general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, mensaje: 'Demasiadas peticiones. Inténtalo más tarde.' },
});

// Rate limiting — auth routes (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, mensaje: 'Demasiados intentos de autenticación. Inténtalo en 15 minutos.' },
});

app.use(generalLimiter);

// ── Middlewares ──────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(require('path').join(__dirname, '../public')));

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

// ── Arranque ─────────────────────────────────
// Conectar a la base de datos (Vercel reutiliza el módulo entre invocaciones)
connectDB();

// Arranque local cuando se ejecuta directamente (npm run dev / npm start)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📡 Entorno: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Exportar la app para Vercel (función serverless)
module.exports = app;

