const express = require('express');
const router = express.Router();
const { obtenerUsuarios, obtenerUsuarioPorId, cambiarEstadoUsuario, eliminarUsuario, estadisticasGlobales } = require('../controllers/usuariosController');
const { proteger, soloAdmin } = require('../middleware/auth');

router.use(proteger, soloAdmin);

router.get('/estadisticas', estadisticasGlobales);
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.put('/:id/estado', cambiarEstadoUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;

