import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import NoticiaCard from '../components/NoticiaCard';
import ArtemisHero from '../components/ArtemisHero';
import { getNoticias } from '../services/noticiasService';
import { buscarArxiv } from '../services/articulosService';
import { useAuth } from '../context/AuthContext';
import type { Noticia, Articulo } from '../types';

// Areas grid data matching the design
const AREAS = [
  { code: 'CS', id: 'cs',           label: 'Informática',   desc: 'IA, sistemas, lenguajes y computación teórica.', count: '314.520' },
  { code: 'PH', id: 'physics',      label: 'Física',        desc: 'Partículas, materia condensada, cosmología.',    count: '289.103' },
  { code: 'MA', id: 'mathematics',  label: 'Matemáticas',   desc: 'Álgebra, análisis, topología, combinatoria.',   count: '198.741' },
  { code: 'BI', id: 'biology',      label: 'Biología',      desc: 'Genética, ecología, biología molecular.',       count: '176.288' },
  { code: 'ME', id: 'medicine',     label: 'Medicina',      desc: 'Clínica, salud pública, farmacología.',         count: '421.970' },
  { code: 'CH', id: 'chemistry',    label: 'Química',       desc: 'Orgánica, materiales, fisicoquímica.',          count: '152.044' },
  { code: 'EC', id: 'economics',    label: 'Economía',      desc: 'Microeconomía, finanzas, econometría.',         count: '88.319' },
  { code: 'PS', id: 'psychology',   label: 'Psicología',    desc: 'Cognición, social, neuropsicología.',           count: '104.752' },
  { code: 'EN', id: 'engineering',  label: 'Ingeniería',    desc: 'Mecánica, eléctrica, civil, software.',         count: '231.144' },
  { code: 'AS', id: 'astronomy',    label: 'Astronomía',    desc: 'Estrellas, exoplanetas, astrofísica.',          count: '147.610' },
  { code: 'EV', id: 'environmental',label: 'Ambiental',     desc: 'Clima, sostenibilidad, biodiversidad.',         count: '92.205' },
  { code: 'NE', id: 'neuroscience', label: 'Neurociencia',  desc: 'Cerebro, sistemas neuronales, cognición.',      count: '76.833' },
];

const TRENDING = [
  'inteligencia artificial', 'cambio climático', 'física cuántica',
  'CRISPR', 'machine learning', 'neurociencia',
];

const HomePage = () => {
  const { usuario } = useAuth();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [articuloDia, setArticuloDia] = useState<Articulo | null>(null);

  useEffect(() => {
    getNoticias('es', 3)
      .then((res) => setNoticias(res.noticias.slice(0, 3)))
      .catch(() => {});

    buscarArxiv({ q: 'foundation models scientific reasoning', limite: 1 })
      .then((res) => { if (res.articulos.length) setArticuloDia(res.articulos[0]); })
      .catch(() => {});
  }, []);

  return (
    <div className="home-page">

      {/* ── HERO EDITORIAL ────────────────────────────────── */}
      <section className="hero-editorial">
        <div className="hero-editorial-inner">
          {/* Left column */}
          <div className="hero-editorial-left">
            <p className="hero-editorial-eyebrow">
              CIENCIA ABIERTA · VOL. 1 · EDICIÓN 2026
            </p>
            <h1 className="hero-editorial-title">
              Una sola interfaz para <em>toda</em> la literatura científica.
            </h1>
            <p className="hero-editorial-sub">
              Centraliza, lee y organiza artículos académicos de arXiv y CrossRef con
              etiquetas, colecciones, comparador y exportación en APA, MLA, BibTeX y RIS.
            </p>

            {/* Search */}
            <div className="hero-editorial-search">
              <SearchBar size="lg" placeholder="Buscar por título, autor, DOI o palabra clave…" />
            </div>

            {/* Source pills */}
            <div className="hero-source-pills">
              <span className="source-pill source-pill--active">Todas las fuentes</span>
              <span className="source-pill">arXiv</span>
              <span className="source-pill">CrossRef</span>
              <Link to="/buscar" className="source-pill source-pill--link">+ Filtros avanzados</Link>
            </div>

            {/* Trending */}
            <div className="hero-trending-light">
              <span className="trending-label-light">Tendencias:</span>
              {TRENDING.map((t) => (
                <Link key={t} to={`/buscar?q=${encodeURIComponent(t)}`} className="trending-tag-light">
                  {t}
                </Link>
              ))}
            </div>
          </div>

          {/* Right column — Artículo del día */}
          <div className="hero-editorial-right">
            <div className="articulo-dia-card">
              <p className="articulo-dia-eyebrow">ARTÍCULO DEL DÍA</p>
              {articuloDia ? (
                <>
                  <h3 className="articulo-dia-title">{articuloDia.titulo}</h3>
                  <p className="articulo-dia-authors">
                    {articuloDia.autores.slice(0, 3).join(', ')}
                    {articuloDia.autores.length > 3 ? ', et al.' : ''}
                    {articuloDia.anio ? ` · ${articuloDia.anio}` : ''}
                  </p>
                  {articuloDia.abstract && (
                    <blockquote className="articulo-dia-abstract">
                      "{articuloDia.abstract.substring(0, 220)}…"
                    </blockquote>
                  )}
                  <div className="articulo-dia-tags">
                    {articuloDia.citaciones != null && (
                      <span className="articulo-dia-tag">{articuloDia.citaciones} citas</span>
                    )}
                    <span className="articulo-dia-tag">arXiv</span>
                    <span className="articulo-dia-tag">open access</span>
                  </div>
                  <Link to={`/articulo/${articuloDia.fuente}/${articuloDia.id}`} className="articulo-dia-link">
                    Leer artículo completo →
                  </Link>
                </>
              ) : (
                <div className="articulo-dia-loading">
                  <div className="skel-line" style={{ width: '100%', marginBottom: '0.5rem' }} />
                  <div className="skel-line" style={{ width: '75%', marginBottom: '1rem' }} />
                  <div className="skel-line" style={{ width: '100%', marginBottom: '0.3rem' }} />
                  <div className="skel-line" style={{ width: '90%' }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────── */}
      <div className="stats-strip-editorial">
        <div className="stats-strip-editorial-inner">
          <div className="stat-editorial">
            <span className="stat-editorial-label">ARTÍCULOS ACCESIBLES</span>
            <span className="stat-editorial-value">2.4M<sup>+</sup></span>
          </div>
          <div className="stat-editorial">
            <span className="stat-editorial-label">ÁREAS CIENTÍFICAS</span>
            <span className="stat-editorial-value">12</span>
          </div>
          <div className="stat-editorial">
            <span className="stat-editorial-label">FUENTES INTEGRADAS</span>
            <span className="stat-editorial-value">2</span>
          </div>
          <div className="stat-editorial">
            <span className="stat-editorial-label">FORMATOS DE CITA</span>
            <span className="stat-editorial-value">4</span>
          </div>
        </div>
      </div>

      {/* ── ARTEMIS II ──────────────────────────────────────── */}
      <section className="section home-areas-section">
        <div className="section-container">
          <p className="section-eyebrow">CIENCIA EN DIRECTO</p>
          <h2 className="section-title-xl" style={{ marginBottom: '1.5rem' }}>Misión Artemis II</h2>
          <ArtemisHero />
        </div>
      </section>

      {/* ── ÁREAS CIENTÍFICAS ─────────────────────────────── */}
      <section className="section home-areas-section">
        <div className="section-container">
          <div className="home-areas-header">
            <h2 className="section-title-xl">Áreas científicas</h2>
            <Link to="/areas" className="home-areas-link">Ver las 12 disciplinas →</Link>
          </div>
          <hr className="home-areas-divider" />
          <div className="home-areas-grid">
            {AREAS.map((area) => (
              <Link key={area.id} to={`/areas/${area.id}`} className="home-area-item">
                <p className="home-area-code">{area.code} · <span>{area.label.toUpperCase()}</span></p>
                <h3 className="home-area-name">{area.label}</h3>
                <p className="home-area-desc">{area.desc}</p>
                <p className="home-area-count">{area.count} artículos &nbsp;<span className="home-area-arrow">→</span></p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOTICIAS DESTACADAS ──────────────────────────── */}
      {noticias.length > 0 && (
        <section className="section home-news-section">
          <div className="section-container">
            <div className="home-news-grid">
              {noticias.map((n) => (
                <NoticiaCard key={n._id || n.url} noticia={n} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <Link to="/noticias" className="btn-outline">
                <Newspaper size={15} /> Ver todas las noticias
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA FINAL ────────────────────────────────────── */}
      {!usuario && (
        <section className="cta-dark-section">
          <div className="cta-dark-inner">
            <p className="section-eyebrow">Únete hoy</p>
            <h2 className="cta-dark-title">Empieza a explorar la ciencia ahora</h2>
            <p className="cta-dark-desc">
              Crea una cuenta gratuita para guardar tus artículos favoritos, ver estadísticas
              personalizadas y recibir recomendaciones a tu medida.
            </p>
            <div className="cta-dark-buttons">
              <Link to="/registro" className="btn-light">Crear cuenta gratis</Link>
              <Link to="/buscar" className="btn-outline-white">Explorar sin registrarse</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
