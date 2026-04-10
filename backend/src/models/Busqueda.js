const mongoose = require('mongoose');

const busquedaSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    termino: {
      type: String,
      required: true,
      trim: true,
    },
    fuente: {
      type: String,
      enum: ['arxiv', 'crossref', 'todas'],
      default: 'todas',
    },
    area: {
      type: String,
      trim: true,
    },
    resultados: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Busqueda', busquedaSchema);

