const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generar token JWT
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Registrar usuario
// @route   POST /api/auth/registro
// @access  Público
const registro = async (req, res) => {
  try {
    const { nombre, email, password, areasInteres } = req.body;

    // Verificar si el email ya existe
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Ya existe un usuario con ese email.',
      });
    }

    const usuario = await User.create({
      nombre,
      email,
      password,
      areasInteres: areasInteres || [],
    });

    const token = generarToken(usuario._id);

    res.status(201).json({
      ok: true,
      mensaje: 'Usuario registrado correctamente.',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        areasInteres: usuario.areasInteres,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al registrar el usuario.',
      error: error.message,
    });
  }
};

// @desc    Login usuario
// @route   POST /api/auth/login
// @access  Público
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Email y contraseña son obligatorios.',
      });
    }

    const usuario = await User.findOne({ email }).select('+password');
    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Credenciales inválidas.',
      });
    }

    const passwordCorrecta = await usuario.compararPassword(password);
    if (!passwordCorrecta) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Credenciales inválidas.',
      });
    }

    const token = generarToken(usuario._id);

    res.json({
      ok: true,
      mensaje: 'Login correcto.',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        areasInteres: usuario.areasInteres,
        avatar: usuario.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al iniciar sesión.',
      error: error.message,
    });
  }
};

// @desc    Obtener perfil del usuario autenticado
// @route   GET /api/auth/perfil
// @access  Privado
const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario._id);
    res.json({
      ok: true,
      usuario,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener el perfil.',
      error: error.message,
    });
  }
};

// @desc    Actualizar perfil del usuario
// @route   PUT /api/auth/perfil
// @access  Privado
const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, avatar, areasInteres } = req.body;

    const usuario = await User.findByIdAndUpdate(
      req.usuario._id,
      { nombre, avatar, areasInteres },
      { new: true, runValidators: true }
    );

    res.json({
      ok: true,
      mensaje: 'Perfil actualizado correctamente.',
      usuario,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al actualizar el perfil.',
      error: error.message,
    });
  }
};

// @desc    Cambiar contraseña
// @route   PUT /api/auth/cambiar-password
// @access  Privado
const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;

    const usuario = await User.findById(req.usuario._id).select('+password');
    const esCorrecta = await usuario.compararPassword(passwordActual);

    if (!esCorrecta) {
      return res.status(401).json({
        ok: false,
        mensaje: 'La contraseña actual no es correcta.',
      });
    }

    usuario.password = passwordNueva;
    await usuario.save();

    res.json({
      ok: true,
      mensaje: 'Contraseña cambiada correctamente.',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al cambiar la contraseña.',
      error: error.message,
    });
  }
};

// @desc    Subir avatar del usuario
// @route   POST /api/auth/avatar
// @access  Privado
const subirAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, mensaje: 'No se ha enviado ningún archivo.' });
    }
    const mimeType = req.file.mimetype;
    const base64 = req.file.buffer.toString('base64');
    const avatarUrl = `data:${mimeType};base64,${base64}`;
    const usuario = await User.findByIdAndUpdate(
      req.usuario._id,
      { avatar: avatarUrl },
      { new: true }
    );
    res.json({ ok: true, mensaje: 'Avatar actualizado.', avatar: avatarUrl, usuario });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al subir el avatar.', error: error.message });
  }
};

module.exports = { registro, login, obtenerPerfil, actualizarPerfil, cambiarPassword, subirAvatar };

