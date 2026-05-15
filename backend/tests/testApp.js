// App Express equivalente a src/app.js pero sin el middleware de conexión a
// MongoDB ni el rate limiting global. Se usa exclusivamente desde los tests:
// la conexión la abre setup.js contra mongodb-memory-server, y el rate limit
// se aplica de forma aislada solo en el test que verifica esa funcionalidad.

const express = require('express');
const helmet = require('helmet');

const authRoutes      = require('../src/routes/authRoutes');
const articulosRoutes = require('../src/routes/articulosRoutes');
const favoritosRoutes = require('../src/routes/favoritosRoutes');
const usuariosRoutes  = require('../src/routes/usuariosRoutes');

function buildTestApp() {
  const app = express();
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/auth',      authRoutes);
  app.use('/api/articulos', articulosRoutes);
  app.use('/api/favoritos', favoritosRoutes);
  app.use('/api/usuarios',  usuariosRoutes);

  app.use((req, res) => res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada.' }));

  return app;
}

module.exports = { buildTestApp };
