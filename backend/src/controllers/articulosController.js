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
// OPENALEX
// ─────────────────────────────────────────────

// Mapeo de áreas internas a concept IDs de OpenAlex (nivel-0)
const OPENALEX_CONCEPT_MAP = {
  cs: 'C41008148',
  physics: 'C121332964',
  mathematics: 'C33923547',
  biology: 'C86803240',
  medicine: 'C71924100',
  chemistry: 'C185592680',
  economics: 'C162324750',
  psychology: 'C15744967',
  engineering: 'C127413603',
  // astronomy / environmental / neuroscience: caen a búsqueda por texto
};

// OpenAlex devuelve el abstract como índice invertido { palabra: [posiciones] }
const reconstruirAbstract = (idx) => {
  if (!idx || typeof idx !== 'object') return '';
  const palabras = [];
  for (const [palabra, posiciones] of Object.entries(idx)) {
    for (const pos of posiciones) palabras[pos] = palabra;
  }
  return palabras.filter(Boolean).join(' ');
};

const mapOpenAlexWork = (item) => {
  const id = (item.id || '').replace('https://openalex.org/', '');
  const titulo = item.title || item.display_name || '';
  const autores = (item.authorships || [])
    .map((a) => a.author?.display_name)
    .filter(Boolean);
  const anio = item.publication_year || null;
  const abstract = reconstruirAbstract(item.abstract_inverted_index);
  const palabrasClave = (item.concepts || [])
    .filter((c) => (c.level ?? 0) >= 1)
    .slice(0, 8)
    .map((c) => c.display_name)
    .filter(Boolean);
  const revista = item.primary_location?.source?.display_name
    || item.host_venue?.display_name
    || '';
  const urlPdf = item.best_oa_location?.pdf_url
    || item.primary_location?.pdf_url
    || (item.open_access?.is_oa ? item.open_access?.oa_url : '')
    || '';
  const doi = item.doi ? item.doi.replace('https://doi.org/', '') : '';
  const urlOriginal = doi
    ? `https://doi.org/${doi}`
    : (item.primary_location?.landing_page_url || `https://openalex.org/${id}`);
  return {
    id,
    fuente: 'openalex',
    titulo,
    autores,
    anio,
    abstract,
    palabrasClave,
    urlOriginal,
    urlPdf,
    revista,
    citaciones: item.cited_by_count || 0,
  };
};

// @desc    Buscar artículos en OpenAlex
// @route   GET /api/articulos/openalex/buscar?q=...&area=...&pagina=1&limite=10
// @access  Público
const buscarOpenAlex = async (req, res) => {
  try {
    const { q, area, pagina = 1, limite = 10, anioDesde, anioHasta, minCitas, orden } = req.query;

    if (!q) {
      return res.status(400).json({ ok: false, mensaje: 'El término de búsqueda es obligatorio.' });
    }

    const filters = [];
    const conceptId = area ? OPENALEX_CONCEPT_MAP[area] : null;
    if (conceptId) filters.push(`concepts.id:${conceptId}`);
    if (anioDesde) filters.push(`publication_year:>=${parseInt(anioDesde, 10)}`);
    if (anioHasta) filters.push(`publication_year:<=${parseInt(anioHasta, 10)}`);
    if (minCitas) filters.push(`cited_by_count:>=${parseInt(minCitas, 10)}`);

    const params = new URLSearchParams({
      search: q,
      page: String(pagina),
      'per-page': String(limite),
    });
    if (filters.length) params.append('filter', filters.join(','));
    if (orden === 'anio') params.set('sort', 'publication_year:desc');
    else if (orden === 'citas') params.set('sort', 'cited_by_count:desc');
    if (process.env.OPENALEX_EMAIL) params.set('mailto', process.env.OPENALEX_EMAIL);

    const url = `https://api.openalex.org/works?${params}`;
    const respuesta = await axios.get(url, { timeout: 10000 });
    const datos = respuesta.data;

    const articulos = (datos.results || []).map(mapOpenAlexWork);

    res.json({
      ok: true,
      total: datos.meta?.count ?? articulos.length,
      articulos,
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al buscar en OpenAlex.', error: error.message });
  }
};

// @desc    Obtener un artículo de OpenAlex por su ID (W…) o por DOI
// @route   GET /api/articulos/openalex/:id
// @access  Público
const obtenerOpenAlexPorId = async (req, res) => {
  try {
    const rawId = decodeURIComponent(req.params.id);
    let identificador = rawId.replace('https://openalex.org/', '');
    if (rawId.startsWith('10.') || rawId.toLowerCase().startsWith('doi:')) {
      identificador = `doi:${rawId.replace(/^doi:/i, '')}`;
    }

    const params = new URLSearchParams();
    if (process.env.OPENALEX_EMAIL) params.set('mailto', process.env.OPENALEX_EMAIL);
    const qs = params.toString();
    const url = `https://api.openalex.org/works/${encodeURIComponent(identificador)}${qs ? `?${qs}` : ''}`;

    const respuesta = await axios.get(url, { timeout: 10000 });
    const articulo = mapOpenAlexWork(respuesta.data);

    res.json({ ok: true, articulo });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ ok: false, mensaje: 'Artículo no encontrado.' });
    }
    res.status(500).json({ ok: false, mensaje: 'Error al obtener el artículo de OpenAlex.', error: error.message });
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
  buscarOpenAlex,
  obtenerOpenAlexPorId,
  obtenerEstadisticas,
};

