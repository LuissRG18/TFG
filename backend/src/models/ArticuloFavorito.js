const mongoose = require('mongoose');

const articuloFavoritoSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // ID externo del artículo (arXiv, Semantic Scholar, etc.)
    articuloId: {
      type: String,
      required: [true, 'El ID del artículo es obligatorio'],
    },
    fuente: {
      type: String,
      enum: ['arxiv', 'semanticscholar', 'crossref', 'otro'],
      required: [true, 'La fuente del artículo es obligatoria'],
    },
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    autores: {
      type: [String],
      default: [],
    },
    anio: {
      type: Number,
    },
    abstract: {
      type: String,
      trim: true,
    },
    abstractDivulgativo: {
      type: String,
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
    palabrasClave: {
      type: [String],
      default: [],
    },
    urlOriginal: {
      type: String,
      trim: true,
    },
    urlPdf: {
      type: String,
      trim: true,
    },
    revista: {
      type: String,
      trim: true,
    },
    notas: {
      type: String,
      trim: true,
      maxlength: [1000, 'Las notas no pueden superar los 1000 caracteres'],
    },
    etiquetas: {
      type: [String],
      default: [],
    },
    leidoMasTarde: {
      type: Boolean,
      default: false,
    },
    coleccion: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

// Índice compuesto para evitar duplicados por usuario y artículo
articuloFavoritoSchema.index({ usuario: 1, articuloId: 1, fuente: 1 }, { unique: true });

module.exports = mongoose.model('ArticuloFavorito', articuloFavoritoSchema);

