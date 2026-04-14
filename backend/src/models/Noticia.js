const mongoose = require('mongoose');

const noticiaSchema = new mongoose.Schema({
  titulo:   { type: String, required: true },
  resumen:  { type: String, default: '' },
  url:      { type: String, required: true },
  imagen:   { type: String, default: null },
  fuente:   { type: String, required: true },
  idioma:   { type: String, enum: ['es', 'en'], required: true },
  fecha:    { type: Date, default: Date.now },
  cachedAt: { type: Date, default: Date.now },
});

// TTL index: MongoDB borra los documentos automáticamente 1 hora después de cachedAt
noticiaSchema.index({ cachedAt: 1 }, { expireAfterSeconds: 3600 });
// Índice para consultas por idioma
noticiaSchema.index({ idioma: 1, cachedAt: -1 });

module.exports = mongoose.model('Noticia', noticiaSchema);
