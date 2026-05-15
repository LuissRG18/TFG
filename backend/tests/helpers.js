const jwt = require('jsonwebtoken');
const User = require('../src/models/User');

// Crea un usuario en la BD de test y devuelve el documento junto con un JWT
// válido para ese usuario. Usa los mismos secretos que el controlador real.
async function crearUsuario({
  nombre = 'Usuario Test',
  email = 'test@example.com',
  password = 'password123',
  rol = 'usuario',
  activo = true,
} = {}) {
  const usuario = await User.create({ nombre, email, password, rol, activo });
  const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
  return { usuario, token };
}

module.exports = { crearUsuario };
