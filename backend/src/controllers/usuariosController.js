const User = require('../models/User');
const ArticuloFavorito = require('../models/ArticuloFavorito');

// @desc    Obtener todos los usuarios (solo admin)
// @route   GET /api/usuarios
// @access  Privado/Admin
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().sort({ createdAt: -1 });
    res.json({ ok: true, total: usuarios.length, usuarios });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener usuarios.', error: error.message });
  }
};

// @desc    Obtener un usuario por ID (solo admin)
// @route   GET /api/usuarios/:id
// @access  Privado/Admin
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });
    }
    res.json({ ok: true, usuario });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener el usuario.', error: error.message });
  }
};

// @desc    Desactivar/activar usuario (solo admin)
// @route   PUT /api/usuarios/:id/estado
// @access  Privado/Admin
const cambiarEstadoUsuario = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });
    }
    usuario.activo = !usuario.activo;
    await usuario.save();
    res.json({
      ok: true,
      mensaje: `Usuario ${usuario.activo ? 'activado' : 'desactivado'} correctamente.`,
      usuario,
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al cambiar el estado del usuario.', error: error.message });
  }
};

// @desc    Eliminar usuario (solo admin)
// @route   DELETE /api/usuarios/:id
// @access  Privado/Admin
const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await User.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });
    }
    // Eliminar también sus favoritos
    await ArticuloFavorito.deleteMany({ usuario: req.params.id });
    res.json({ ok: true, mensaje: 'Usuario y sus datos eliminados correctamente.' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar el usuario.', error: error.message });
  }
};

// @desc    Estadísticas globales de la plataforma (admin)
// @route   GET /api/usuarios/estadisticas
// @access  Privado/Admin
const estadisticasGlobales = async (req, res) => {
  try {
    const Busqueda = require('../models/Busqueda');
    const totalUsuarios = await User.countDocuments();
    const totalActivos  = await User.countDocuments({ activo: true });
    const totalFavoritos = await ArticuloFavorito.countDocuments();
    const totalBusquedas = await Busqueda.countDocuments();

    const usuariosPorMes = await User.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, total: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    const favoritosPorFuente = await ArticuloFavorito.aggregate([
      { $group: { _id: '$fuente', total: { $sum: 1 } } },
    ]);

    const busquedasPorFuente = await Busqueda.aggregate([
      { $group: { _id: '$fuente', total: { $sum: 1 } } },
    ]);

    res.json({
      ok: true,
      estadisticas: {
        totalUsuarios,
        totalActivos,
        totalFavoritos,
        totalBusquedas,
        usuariosPorMes,
        favoritosPorFuente,
        busquedasPorFuente,
      },
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener estadísticas globales.', error: error.message });
  }
};

module.exports = { obtenerUsuarios, obtenerUsuarioPorId, cambiarEstadoUsuario, eliminarUsuario, estadisticasGlobales };


