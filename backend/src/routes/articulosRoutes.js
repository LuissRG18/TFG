const express = require('express');
const router = express.Router();
const {
  buscarArxiv,
  buscarSemanticScholar,
  obtenerDetalleSemanticScholar,
  buscarCrossRef,
  obtenerEstadisticas,
} = require('../controllers/articulosController');
const { proteger } = require('../middleware/auth');

// Rutas públicas
router.get('/arxiv/buscar', buscarArxiv);
router.get('/semantic/buscar', buscarSemanticScholar);
router.get('/semantic/:paperId', obtenerDetalleSemanticScholar);
router.get('/crossref/buscar', buscarCrossRef);

// Rutas privadas
router.get('/estadisticas', proteger, obtenerEstadisticas);

module.exports = router;

