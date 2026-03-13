const jwt = require('jsonwebtoken');
const User = require('../models/User');

const proteger = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      ok: false,
      mensaje: 'No autorizado. Token no proporcionado.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await User.findById(decoded.id).select('-password');

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        ok: false,
        mensaje: 'No autorizado. Usuario no encontrado o inactivo.',
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      mensaje: 'No autorizado. Token inválido o expirado.',
    });
  }
};

const soloAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    return next();
  }
  return res.status(403).json({
    ok: false,
    mensaje: 'Acceso denegado. Se requieren permisos de administrador.',
  });
};

module.exports = { proteger, soloAdmin };

