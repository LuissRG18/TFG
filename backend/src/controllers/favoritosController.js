const ArticuloFavorito = require('../models/ArticuloFavorito');
const Busqueda = require('../models/Busqueda');

// @desc    Obtener todos los favoritos del usuario
// @route   GET /api/favoritos
// @access  Privado
const obtenerFavoritos = async (req, res) => {
  try {
    const { area, fuente, etiqueta, leidoMasTarde, pagina = 1, limite = 20 } = req.query;
    const filtro = { usuario: req.usuario._id };

    if (area) filtro.area = area;
    if (fuente) filtro.fuente = fuente;
    if (etiqueta) filtro.etiquetas = etiqueta;
    if (leidoMasTarde !== undefined) filtro.leidoMasTarde = leidoMasTarde === 'true';

    const total = await ArticuloFavorito.countDocuments(filtro);
    const favoritos = await ArticuloFavorito.find(filtro)
      .sort({ createdAt: -1 })
      .skip((pagina - 1) * limite)
      .limit(Number(limite));

    res.json({
      ok: true,
      total,
      pagina: Number(pagina),
      totalPaginas: Math.ceil(total / limite),
      favoritos,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener los favoritos.',
      error: error.message,
    });
  }
};

// @desc    Añadir artículo a favoritos
// @route   POST /api/favoritos
// @access  Privado
const agregarFavorito = async (req, res) => {
  try {
    const { articuloId, fuente, titulo, autores, anio, abstract, abstractDivulgativo,
            area, palabrasClave, urlOriginal, urlPdf, revista, notas, etiquetas, coleccion } = req.body;

    const yaExiste = await ArticuloFavorito.findOne({
      usuario: req.usuario._id,
      articuloId,
      fuente,
    });

    if (yaExiste) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Este artículo ya está en tus favoritos.',
      });
    }

    const favorito = await ArticuloFavorito.create({
      usuario: req.usuario._id,
      articuloId, fuente, titulo, autores, anio, abstract, abstractDivulgativo,
      area, palabrasClave, urlOriginal, urlPdf, revista, notas, etiquetas, coleccion: coleccion || '',
    });

    res.status(201).json({
      ok: true,
      mensaje: 'Artículo añadido a favoritos.',
      favorito,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al añadir el favorito.',
      error: error.message,
    });
  }
};

// @desc    Actualizar notas/etiquetas de un favorito
// @route   PUT /api/favoritos/:id
// @access  Privado
const actualizarFavorito = async (req, res) => {
  try {
    const favorito = await ArticuloFavorito.findOne({
      _id: req.params.id,
      usuario: req.usuario._id,
    });

    if (!favorito) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Favorito no encontrado.',
      });
    }

    const { notas, etiquetas, leidoMasTarde, abstractDivulgativo, coleccion } = req.body;
    if (notas !== undefined) favorito.notas = notas;
    if (etiquetas !== undefined) favorito.etiquetas = etiquetas;
    if (leidoMasTarde !== undefined) favorito.leidoMasTarde = leidoMasTarde;
    if (abstractDivulgativo !== undefined) favorito.abstractDivulgativo = abstractDivulgativo;
    if (coleccion !== undefined) favorito.coleccion = coleccion;

    await favorito.save();

    res.json({
      ok: true,
      mensaje: 'Favorito actualizado.',
      favorito,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al actualizar el favorito.',
      error: error.message,
    });
  }
};

// @desc    Eliminar artículo de favoritos
// @route   DELETE /api/favoritos/:id
// @access  Privado
const eliminarFavorito = async (req, res) => {
  try {
    const favorito = await ArticuloFavorito.findOneAndDelete({
      _id: req.params.id,
      usuario: req.usuario._id,
    });

    if (!favorito) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Favorito no encontrado.',
      });
    }

    res.json({
      ok: true,
      mensaje: 'Artículo eliminado de favoritos.',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al eliminar el favorito.',
      error: error.message,
    });
  }
};

// @desc    Comprobar si un artículo está en favoritos
// @route   GET /api/favoritos/check/:articuloId
// @access  Privado
const checkFavorito = async (req, res) => {
  try {
    const { id, fuente } = req.query;
    if (!id) return res.status(400).json({ ok: false, mensaje: 'id es obligatorio.' });
    const favorito = await ArticuloFavorito.findOne({
      usuario: req.usuario._id,
      articuloId: id,
      ...(fuente && { fuente }),
    });

    res.json({
      ok: true,
      esFavorito: !!favorito,
      favorito: favorito || null,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al comprobar el favorito.',
      error: error.message,
    });
  }
};

// @desc    Guardar búsqueda del usuario
// @route   POST /api/favoritos/busqueda
// @access  Privado
const guardarBusqueda = async (req, res) => {
  try {
    const { termino, fuente, area, resultados } = req.body;
    const busqueda = await Busqueda.create({
      usuario: req.usuario._id,
      termino, fuente, area, resultados,
    });
    res.status(201).json({ ok: true, busqueda });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al guardar la búsqueda.', error: error.message });
  }
};

// @desc    Historial de búsquedas del usuario
// @route   GET /api/favoritos/busquedas
// @access  Privado
const obtenerBusquedas = async (req, res) => {
  try {
    const { pagina = 1, limite = 30 } = req.query;
    const total = await Busqueda.countDocuments({ usuario: req.usuario._id });
    const busquedas = await Busqueda.find({ usuario: req.usuario._id })
      .sort({ createdAt: -1 })
      .skip((pagina - 1) * Number(limite))
      .limit(Number(limite));
    res.json({ ok: true, total, totalPaginas: Math.ceil(total / limite), busquedas });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener el historial.', error: error.message });
  }
};

// @desc    Eliminar una búsqueda del historial
// @route   DELETE /api/favoritos/busquedas/:id
// @access  Privado
const eliminarBusqueda = async (req, res) => {
  try {
    const busqueda = await Busqueda.findOneAndDelete({
      _id: req.params.id,
      usuario: req.usuario._id,
    });
    if (!busqueda) return res.status(404).json({ ok: false, mensaje: 'Búsqueda no encontrada.' });
    res.json({ ok: true, mensaje: 'Búsqueda eliminada.' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar la búsqueda.', error: error.message });
  }
};

// @desc    Obtener colecciones del usuario (lista de nombres únicos)
// @route   GET /api/favoritos/colecciones
// @access  Privado
const obtenerColecciones = async (req, res) => {
  try {
    const resultado = await ArticuloFavorito.aggregate([
      { $match: { usuario: req.usuario._id, coleccion: { $ne: '' } } },
      { $group: { _id: '$coleccion', total: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json({ ok: true, colecciones: resultado });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener colecciones.', error: error.message });
  }
};

module.exports = {
  obtenerFavoritos,
  agregarFavorito,
  actualizarFavorito,
  eliminarFavorito,
  checkFavorito,
  guardarBusqueda,
  obtenerBusquedas,
  eliminarBusqueda,
  obtenerColecciones,
};

