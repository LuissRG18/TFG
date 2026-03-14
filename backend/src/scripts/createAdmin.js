/**
 * Script para crear (o restaurar) el usuario administrador.
 *
 * Uso:
 *   node src/scripts/createAdmin.js
 *
 * Las credenciales se leen de las variables de entorno:
 *   ADMIN_EMAIL    (por defecto: admin@scilens.com)
 *   ADMIN_PASSWORD (por defecto: Admin1234!)
 *   ADMIN_NOMBRE   (por defecto: Administrador)
 *
 * Si el usuario ya existe, actualiza su contraseña y lo marca como activo.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@scilens.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin1234!';
const ADMIN_NOMBRE   = process.env.ADMIN_NOMBRE   || 'Administrador';

(async () => {
  await connectDB();

  let usuario = await User.findOne({ email: ADMIN_EMAIL }).select('+password');

  if (usuario) {
    // Actualizar contraseña y asegurar rol admin
    usuario.password = ADMIN_PASSWORD;   // el pre-save hook hará el hash
    usuario.rol = 'admin';
    usuario.activo = true;
    await usuario.save();
    console.log(`✅ Usuario admin actualizado: ${ADMIN_EMAIL}`);
  } else {
    await User.create({
      nombre: ADMIN_NOMBRE,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      rol: 'admin',
      activo: true,
    });
    console.log(`✅ Usuario admin creado: ${ADMIN_EMAIL}`);
  }

  await mongoose.disconnect();
  process.exit(0);
})();
