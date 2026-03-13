const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { registro, login, obtenerPerfil, actualizarPerfil, cambiarPassword, subirAvatar } = require('../controllers/authController');
const { proteger } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../public/avatars'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar-${Date.now()}${ext}`);
  },
});
const fileFilter = (_req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Solo se permiten imágenes (jpg, png, webp, gif).'));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }); // 2 MB

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', proteger, obtenerPerfil);
router.put('/perfil', proteger, actualizarPerfil);
router.put('/cambiar-password', proteger, cambiarPassword);
router.post('/avatar', proteger, upload.single('avatar'), subirAvatar);

module.exports = router;

