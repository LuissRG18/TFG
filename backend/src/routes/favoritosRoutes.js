const express = require('express');
const router = express.Router();
const {
  obtenerFavoritos,
  agregarFavorito,
  actualizarFavorito,
  eliminarFavorito,
  checkFavorito,
  guardarBusqueda,
  obtenerBusquedas,
  eliminarBusqueda,
  obtenerColecciones,
} = require('../controllers/favoritosController');
const { proteger } = require('../middleware/auth');

router.use(proteger);

router.get('/', obtenerFavoritos);
router.post('/', agregarFavorito);
router.put('/:id', actualizarFavorito);
router.delete('/:id', eliminarFavorito);
router.get('/check', checkFavorito);
router.post('/busqueda', guardarBusqueda);
router.get('/busquedas', obtenerBusquedas);
router.delete('/busquedas/:id', eliminarBusqueda);
router.get('/colecciones', obtenerColecciones);

module.exports = router;

