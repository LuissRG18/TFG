const express = require('express');
const router = express.Router();
const { getNoticias } = require('../controllers/noticiasController');

// GET /api/noticias?idioma=es&limite=20
router.get('/', getNoticias);

module.exports = router;
