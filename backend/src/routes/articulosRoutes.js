const express = require('express');
const router = express.Router();
const {
  buscarArxiv,
  buscarCrossRef,
  buscarOpenAlex,
  obtenerArxivPorId,
  obtenerOpenAlexPorId,
  obtenerEstadisticas,
} = require('../controllers/articulosController');
const { proteger } = require('../middleware/auth');

// Rutas públicas
router.get('/arxiv/buscar', buscarArxiv);
router.get('/arxiv/:id', obtenerArxivPorId);
router.get('/crossref/buscar', buscarCrossRef);
router.get('/openalex/buscar', buscarOpenAlex);
router.get('/openalex/:id', obtenerOpenAlexPorId);

// Rutas privadas
router.get('/estadisticas', proteger, obtenerEstadisticas);

module.exports = router;

