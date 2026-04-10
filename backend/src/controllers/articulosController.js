const axios = require('axios');

// ─────────────────────────────────────────────
// ARXIV
// ─────────────────────────────────────────────

// Mapping from our internal area IDs to valid arXiv category prefixes
const ARXIV_CAT_MAP = {
  cs: 'cs',
  physics: 'physics',
  mathematics: 'math',
  biology: 'q-bio',
  medicine: 'q-bio',
  chemistry: 'physics.chem-ph',
  economics: 'econ',
  psychology: 'q-bio.NC',
  engineering: 'eess',
  astronomy: 'astro-ph',
  environmental: 'physics.ao-ph',
  neuroscience: 'q-bio.NC',
};

// @desc    Buscar artículos en arXiv
// @route   GET /api/articulos/arxiv/buscar?q=...&area=...&pagina=1&limite=10
// @access  Público
const buscarArxiv = async (req, res) => {
  try {
    const { q, area, pagina = 1, limite = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ ok: false, mensaje: 'El término de búsqueda es obligatorio.' });
    }

    const inicio = (pagina - 1) * limite;
    let query = `all:${encodeURIComponent(q)}`;
    const arxivCat = area ? (ARXIV_CAT_MAP[area] || null) : null;
    if (arxivCat) query += `+AND+cat:${arxivCat}`;

    const url = `https://export.arxiv.org/api/query?search_query=${query}&start=${inicio}&max_results=${limite}&sortBy=relevance&sortOrder=descending`;

    const respuesta = await axios.get(url, { timeout: 10000 });
    const xml = respuesta.data;

    // Parseo básico del XML de arXiv
    const entradas = xml.match(/<entry>([\s\S]*?)<\/entry>/g) || [];

    const articulos = entradas.map((entrada) => {
      const getId = (tag) => {
        const m = entrada.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
        return m ? m[1].trim() : '';
      };

      const id = getId('id').replace('http://arxiv.org/abs/', '').replace('https://arxiv.org/abs/', '');
      const titulo = getId('title').replace(/\s+/g, ' ');
      const abstract = getId('summary').replace(/\s+/g, ' ');
      const publicado = getId('published');
      const anio = publicado ? new Date(publicado).getFullYear() : null;

      const autoresMatch = entrada.match(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/g) || [];
      const autores = autoresMatch.map((a) => {
        const m = a.match(/<name>([\s\S]*?)<\/name>/);
        return m ? m[1].trim() : '';
      });

      const categoriasMatch = entrada.match(/term="([^"]+)"/g) || [];
      const categorias = categoriasMatch.map((c) => c.replace(/term="([^"]+)"/, '$1'));

      return {
        id,
        fuente: 'arxiv',
        titulo,
        autores,
        anio,
        abstract,
        palabrasClave: categorias,
        urlOriginal: `https://arxiv.org/abs/${id}`,
        urlPdf: `https://arxiv.org/pdf/${id}`,
        revista: 'arXiv',
      };
    });

    res.json({ ok: true, total: articulos.length, articulos });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al buscar en arXiv.', error: error.message });
  }
};

// @desc    Obtener un artículo de arXiv por su ID exacto
// @route   GET /api/articulos/arxiv/:id
// @access  Público
const obtenerArxivPorId = async (req, res) => {
  try {
    const id = decodeURIComponent(req.params.id);
    const url = `https://export.arxiv.org/api/query?id_list=${encodeURIComponent(id)}&max_results=1`;

    const respuesta = await axios.get(url, { timeout: 10000 });
    const xml = respuesta.data;

    const entradas = xml.match(/<entry>([\s\S]*?)<\/entry>/g) || [];
    if (entradas.length === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Artículo no encontrado.' });
    }

    const entrada = entradas[0];
    const getId = (tag) => {
      const m = entrada.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
      return m ? m[1].trim() : '';
    };

    const artId = getId('id').replace('http://arxiv.org/abs/', '').replace('https://arxiv.org/abs/', '');
    const titulo = getId('title').replace(/\s+/g, ' ');
    const abstract = getId('summary').replace(/\s+/g, ' ');
    const publicado = getId('published');
    const anio = publicado ? new Date(publicado).getFullYear() : null;

    const autoresMatch = entrada.match(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/g) || [];
    const autores = autoresMatch.map((a) => {
      const m = a.match(/<name>([\s\S]*?)<\/name>/);
      return m ? m[1].trim() : '';
    });

    const categoriasMatch = entrada.match(/term="([^"]+)"/g) || [];
    const categorias = [...new Set(categoriasMatch.map((c) => c.replace(/term="([^"]+)"/, '$1')))];

    const articulo = {
      id: artId,
      fuente: 'arxiv',
      titulo,
      autores,
      anio,
      abstract,
      palabrasClave: categorias,
      urlOriginal: `https://arxiv.org/abs/${artId}`,
      urlPdf: `https://arxiv.org/pdf/${artId}`,
      revista: 'arXiv',
    };

    res.json({ ok: true, articulo });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener el artículo de arXiv.', error: error.message });
  }
};

// ─────────────────────────────────────────────
// CROSSREF
// ─────────────────────────────────────────────



// ─────────────────────────────────────────────
// CROSSREF
// ─────────────────────────────────────────────

// @desc    Buscar artículos en CrossRef
// @route   GET /api/articulos/crossref/buscar?q=...&pagina=1&limite=10
// @access  Público
const buscarCrossRef = async (req, res) => {
  try {
    const { q, autor, pagina = 1, limite = 10 } = req.query;

    if (!q && !autor) {
      return res.status(400).json({ ok: false, mensaje: 'El término de búsqueda es obligatorio.' });
    }

    const offset = (pagina - 1) * limite;
    const params = new URLSearchParams({
      rows: limite.toString(),
      offset: offset.toString(),
      select: 'DOI,title,author,published,abstract,subject,URL,container-title,is-referenced-by-count',
    });

    if (q) params.append('query', q);
    if (autor) params.append('query.author', autor);

    const url = `https://api.crossref.org/works?${params}`;
    const respuesta = await axios.get(url, { timeout: 10000 });
    const datos = respuesta.data.message;

    const articulos = (datos.items || []).map((item) => {
      const anio = item.published?.['date-parts']?.[0]?.[0] || null;
      const autores = (item.author || []).map((a) => `${a.given || ''} ${a.family || ''}`.trim());
      const titulo = Array.isArray(item.title) ? item.title[0] : item.title || '';
      const revista = Array.isArray(item['container-title'])
        ? item['container-title'][0]
        : item['container-title'] || '';

      return {
        id: item.DOI,
        fuente: 'crossref',
        titulo,
        autores,
        anio,
        abstract: item.abstract || '',
        palabrasClave: item.subject || [],
        urlOriginal: item.URL || `https://doi.org/${item.DOI}`,
        urlPdf: '',
        revista,
        citaciones: item['is-referenced-by-count'] || 0,
      };
    });

    res.json({
      ok: true,
      total: datos['total-results'] || articulos.length,
      articulos,
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al buscar en CrossRef.', error: error.message });
  }
};

// ─────────────────────────────────────────────
// ESTADÍSTICAS
// ─────────────────────────────────────────────

// @desc    Obtener estadísticas de los favoritos del usuario (para gráficos)
// @route   GET /api/articulos/estadisticas
// @access  Privado
const obtenerEstadisticas = async (req, res) => {
  try {
    const ArticuloFavorito = require('../models/ArticuloFavorito');
    const userId = req.usuario._id;

    const porAnio = await ArticuloFavorito.aggregate([
      { $match: { usuario: userId } },
      { $group: { _id: '$anio', total: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const porArea = await ArticuloFavorito.aggregate([
      { $match: { usuario: userId } },
      { $group: { _id: '$area', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    const porFuente = await ArticuloFavorito.aggregate([
      { $match: { usuario: userId } },
      { $group: { _id: '$fuente', total: { $sum: 1 } } },
    ]);

    const totalFavoritos = await ArticuloFavorito.countDocuments({ usuario: userId });

    res.json({
      ok: true,
      estadisticas: {
        totalFavoritos,
        porAnio,
        porArea,
        porFuente,
      },
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener estadísticas.', error: error.message });
  }
};

module.exports = {
  obtenerArxivPorId,
  buscarArxiv,
  buscarCrossRef,
  obtenerEstadisticas,
};

