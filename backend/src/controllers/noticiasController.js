const Parser = require('rss-parser');
const Noticia = require('../models/Noticia');

const FEEDS = {
  es: [
    { url: 'https://www.agenciasinc.es/rss/portada',                                                            fuente: 'SINC' },
    { url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/ciencia/portada',                  fuente: 'El País Ciencia' },
    { url: 'https://feeds.bbci.co.uk/mundo/ciencia_y_tecnologia/rss.xml',                                       fuente: 'BBC Mundo' },
  ],
  en: [
    { url: 'https://phys.org/rss-feed/',        fuente: 'Phys.org' },
    { url: 'https://www.nature.com/nature.rss',  fuente: 'Nature' },
  ],
};

// Palabras clave científicas — si título o resumen contienen al menos una, la noticia pasa
const SCIENCE_KEYWORDS_ES = [
  'ciencia', 'científic', 'investigaci', 'investigador', 'descubrimiento',
  'experimento', 'laboratorio', 'biolog', 'quím', 'físic', 'astronom', 'genétic', 'genómic',
  'neurociencia', 'cerebro', 'vacuna', 'virus', 'bacteria', 'pandemia',
  'cambio climático', 'calentamiento global', 'emisiones de co2',
  'especie', 'evolución', 'fósil', 'planeta', 'galaxia', 'universo', 'átomo', 'partícula',
  'medicina', 'cáncer', 'célula', 'proteína', 'adn', 'arn', 'genoma',
  'matemátic', 'inteligencia artificial', 'aprendizaje automático',
  'misión espacial', 'nasa', 'telescopio', 'agujero negro', 'materia oscura',
  'ecología', 'biodiversidad', 'ecosistema', 'deforestación', 'energía renovable',
  'fusión nuclear', 'cuántic', 'superconductor', 'nanotecnolog',
  'fármaco', 'ensayo clínico', 'estudio científico', 'hallazgo científico',
];

const SCIENCE_KEYWORDS_EN = [
  'science', 'scientific', 'research', 'researcher', 'discovery',
  'experiment', 'laboratory', 'biology', 'chemistry', 'physics', 'astronomy', 'genetic',
  'genomic', 'neuroscience', 'brain', 'vaccine', 'virus', 'bacteria', 'pandemic',
  'climate change', 'global warming', 'co2 emissions',
  'species', 'evolution', 'fossil', 'planet', 'galaxy',
  'universe', 'atom', 'particle', 'medicine', 'cancer',
  'cell', 'protein', 'dna', 'rna', 'genome', 'artificial intelligence', 'machine learning',
  'space mission', 'nasa', 'telescope', 'black hole', 'dark matter',
  'ecology', 'biodiversity', 'ecosystem', 'deforestation', 'renewable energy',
  'nuclear fusion', 'quantum', 'superconductor', 'nanotechnology',
  'drug', 'clinical trial', 'scientific study', 'astrophysics', 'biochemistry',
];

// Términos que indican contenido político/no científico — si aparecen solos, se descarta la noticia
const POLITICAL_BLACKLIST_ES = [
  'elecciones', 'partido político', 'campaña electoral', 'candidato', 'diputado',
  'senador', 'congreso de los diputados', 'senado', 'coalición', 'referéndum',
  'presupuesto general', 'reforma laboral', 'negociación sindical', 'huelga general',
  'relaciones exteriores', 'tratado de paz', 'conflicto armado', 'acuerdo diplomático',
];

const POLITICAL_BLACKLIST_EN = [
  'election', 'political party', 'electoral campaign', 'candidate', 'congressman',
  'senator', 'coalition government', 'referendum', 'general budget',
  'labor reform', 'trade union', 'general strike', 'foreign relations',
  'peace treaty', 'armed conflict', 'diplomatic agreement',
];

function isScience(titulo, resumen, idioma) {
  const text = `${titulo} ${resumen}`.toLowerCase();
  const keywords = idioma === 'en' ? SCIENCE_KEYWORDS_EN : SCIENCE_KEYWORDS_ES;
  const blacklist = idioma === 'en' ? POLITICAL_BLACKLIST_EN : POLITICAL_BLACKLIST_ES;

  const hasScience = keywords.some((kw) => text.includes(kw));
  if (!hasScience) return false;

  // Si contiene algún término político Y no tiene una keyword científica fuerte, descartar
  const hasBlacklisted = blacklist.some((bl) => text.includes(bl));
  if (hasBlacklisted) return false;

  return true;
}

/**
 * Extrae la URL de imagen de distintos campos RSS que usan distintos namespaces.
 */
function extractImage(item) {
  // media:content (objeto con $)
  if (item['media:content']?.['$']?.url) return item['media:content']['$'].url;
  // media:thumbnail
  if (item['media:thumbnail']?.['$']?.url) return item['media:thumbnail']['$'].url;
  // enclosure
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image')) return item.enclosure.url;
  // itunes:image (algún feed lo usa)
  if (item['itunes:image']) return item['itunes:image'];
  // Imagen en el campo content: busca primer src de <img>
  if (item.content) {
    const match = item.content.match(/<img[^>]+src="([^">]+)"/i);
    if (match) return match[1];
  }
  return null;
}

async function fetchAndCache(idioma) {
  const parser = new Parser({
    timeout: 10000,
    customFields: {
      item: [
        ['media:content',   'media:content',   { keepArray: false }],
        ['media:thumbnail', 'media:thumbnail', { keepArray: false }],
      ],
    },
  });

  const feeds = FEEDS[idioma] || FEEDS.es;
  const items = [];

  for (const { url, fuente } of feeds) {
    try {
      const feed = await parser.parseURL(url);
      for (const item of (feed.items || []).slice(0, 20)) {
        // Limpia el resumen de etiquetas HTML
        const rawSnippet = item.contentSnippet || item.summary || item.description || '';
        const resumen = rawSnippet.replace(/<[^>]+>/g, '').trim().slice(0, 400);
        const titulo = (item.title || '').trim();

        // Descarta noticias sin relación científica
        if (!isScience(titulo, resumen, idioma)) continue;

        items.push({
          titulo,
          resumen,
          url:      item.link || item.guid || '',
          imagen:   extractImage(item),
          fuente,
          idioma,
          fecha:    item.pubDate ? new Date(item.pubDate) : new Date(),
          cachedAt: new Date(),
        });
      }
    } catch (err) {
      console.error(`[Noticias] Error en feed ${fuente}:`, err.message);
    }
  }

  if (items.length > 0) {
    await Noticia.deleteMany({ idioma });
    await Noticia.insertMany(items);
  }

  return items;
}

// GET /api/noticias?idioma=es&limite=20
exports.getNoticias = async (req, res) => {
  try {
    const idioma = req.query.idioma === 'en' ? 'en' : 'es';
    const limite = Math.min(parseInt(req.query.limite) || 30, 50);

    // Comprueba si hay noticias cacheadas (el TTL de MongoDB aún no las borró)
    const cached = await Noticia.find({ idioma }).sort({ fecha: -1 }).limit(limite).lean();

    if (cached.length > 0) {
      return res.json({ ok: true, fuente: 'cache', noticias: cached });
    }

    // No hay cache → fetcha y guarda
    const noticias = await fetchAndCache(idioma);
    return res.json({ ok: true, fuente: 'rss', noticias: noticias.slice(0, limite) });
  } catch (err) {
    console.error('[Noticias] Error:', err);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener noticias.' });
  }
};
