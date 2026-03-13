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

module.exports = { obtenerUsuarios, obtenerUsuarioPorId, cambiarEstadoUsuario, eliminarUsuario };

