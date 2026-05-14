import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Cpu, Atom, Calculator, Dna, Stethoscope, FlaskConical, TrendingUp, Brain, Wrench, Telescope, Leaf, Activity } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import NoticiaCard from '../components/NoticiaCard';
import ArtemisHero from '../components/ArtemisHero';
import { getNoticias } from '../services/noticiasService';
import { buscarArxiv } from '../services/articulosService';
import { useAuth } from '../context/AuthContext';
import type { Noticia, Articulo } from '../types';
import outerSpaceBg from '../assets/descarga.jfif';

// Animated counter — self-contained component so ref never leaks to parent
function StatCounter({ target, duration = 1800, suffix = '', className }: {
  target: number; duration?: number; suffix?: string; className?: string;
}) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  const animate = useCallback(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  const setRef = useCallback((node: HTMLSpanElement | null) => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) animate(); },
      { threshold: 0.3 }
    );
    observer.observe(node);
  }, [animate]);

  const display = count >= 1_000_000
    ? `${(count / 1_000_000).toFixed(1)}M`
    : count >= 1_000
    ? `${(count / 1_000).toFixed(0)}K`
    : `${count}`;

  return <span ref={setRef} className={className}>{display}{suffix}</span>;
}

// Areas grid data — raw count used for progress bar (max = 421970 = Medicina)
const MAX_COUNT = 421970;
const AREAS = [
  { code: 'CS',  id: 'cs',            label: 'Informática',  desc: 'IA, sistemas, lenguajes y computación teórica.',  rawCount: 314520,  accent: '#3b82f6', Icon: Cpu },
  { code: 'PH',  id: 'physics',       label: 'Física',       desc: 'Partículas, materia condensada, cosmología.',     rawCount: 289103,  accent: '#8b5cf6', Icon: Atom },
  { code: 'MA',  id: 'mathematics',   label: 'Matemáticas',  desc: 'Álgebra, análisis, topología, combinatoria.',    rawCount: 198741,  accent: '#06b6d4', Icon: Calculator },
  { code: 'BI',  id: 'biology',       label: 'Biología',     desc: 'Genética, ecología, biología molecular.',        rawCount: 176288,  accent: '#10b981', Icon: Dna },
  { code: 'ME',  id: 'medicine',      label: 'Medicina',     desc: 'Clínica, salud pública, farmacología.',          rawCount: 421970,  accent: '#ef4444', Icon: Stethoscope },
  { code: 'CH',  id: 'chemistry',     label: 'Química',      desc: 'Orgánica, materiales, fisicoquímica.',           rawCount: 152044,  accent: '#f59e0b', Icon: FlaskConical },
  { code: 'EC',  id: 'economics',     label: 'Economía',     desc: 'Microeconomía, finanzas, econometría.',          rawCount: 88319,   accent: '#14b8a6', Icon: TrendingUp },
  { code: 'PS',  id: 'psychology',    label: 'Psicología',   desc: 'Cognición, social, neuropsicología.',            rawCount: 104752,  accent: '#ec4899', Icon: Brain },
  { code: 'EN',  id: 'engineering',   label: 'Ingeniería',   desc: 'Mecánica, eléctrica, civil, software.',          rawCount: 231144,  accent: '#f97316', Icon: Wrench },
  { code: 'AS',  id: 'astronomy',     label: 'Astronomía',   desc: 'Estrellas, exoplanetas, astrofísica.',           rawCount: 147610,  accent: '#6366f1', Icon: Telescope },
  { code: 'EV',  id: 'environmental', label: 'Ambiental',    desc: 'Clima, sostenibilidad, biodiversidad.',          rawCount: 92205,   accent: '#84cc16', Icon: Leaf },
  { code: 'NE',  id: 'neuroscience',  label: 'Neurociencia', desc: 'Cerebro, sistemas neuronales, cognición.',       rawCount: 76833,   accent: '#d946ef', Icon: Activity },
];

const fmtCount = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` :
  n >= 1_000     ? `${(n / 1_000).toFixed(0)}K`     : `${n}`;

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
      <section className="hero-editorial" style={{ backgroundImage: `url(${outerSpaceBg})` }}>
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
              Centraliza, lee y organiza artículos académicos de arXiv, CrossRef y OpenAlex con
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
              <span className="source-pill">OpenAlex</span>
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
            <StatCounter target={2400000} duration={1800} suffix="+" className="stat-editorial-value" />
          </div>
          <div className="stat-editorial">
            <span className="stat-editorial-label">ÁREAS CIENTÍFICAS</span>
            <StatCounter target={12} duration={1000} className="stat-editorial-value" />
          </div>
          <div className="stat-editorial">
            <span className="stat-editorial-label">FUENTES INTEGRADAS</span>
            <StatCounter target={3} duration={800} className="stat-editorial-value" />
          </div>
          <div className="stat-editorial">
            <span className="stat-editorial-label">FORMATOS DE CITA</span>
            <StatCounter target={4} duration={800} className="stat-editorial-value" />
          </div>
        </div>
      </div>

      {/* ── WAVE TRANSITION ──────────────────────────────── */}
      <div className="home-wave-transition" aria-hidden="true">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--oxford)" />
        </svg>
      </div>

      {/* ── ÁREAS CIENTÍFICAS ─────────────────────────────── */}
      <section className="section home-areas-section">
        <div className="section-container">
          <div className="home-areas-header">
            <h2 className="section-title-xl">Áreas científicas</h2>
            <Link to="/areas" className="home-areas-link">Ver las 12 disciplinas →</Link>
          </div>
          <hr className="home-areas-divider" />
          <div className="home-areas-grid">
            {AREAS.map((area) => {
              const { Icon } = area;
              const pct = Math.round((area.rawCount / MAX_COUNT) * 100);
              return (
                <Link
                  key={area.id}
                  to={`/areas/${area.id}`}
                  className="home-area-item"
                  style={{ '--area-accent': area.accent } as React.CSSProperties}
                >
                  <div className="home-area-top-row">
                    <span className="home-area-badge">{area.code}</span>
                    <span className="home-area-icon"><Icon size={16} /></span>
                  </div>
                  <h3 className="home-area-name">{area.label}</h3>
                  <p className="home-area-desc">{area.desc}</p>
                  <div className="home-area-footer">
                    <span className="home-area-count">
                      <strong>{fmtCount(area.rawCount)}</strong> artículos
                    </span>
                    <span className="home-area-arrow">→</span>
                  </div>
                  <div className="home-area-bar">
                    <div className="home-area-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── NOTICIAS DESTACADAS ──────────────────────────── */}
      <section className="section home-news-section">
        <div className="section-container">
          <div className="home-areas-header">
            <h2 className="section-title-xl">Noticias</h2>
            <Link to="/noticias" className="home-areas-link">Ver todas las noticias →</Link>
          </div>
          <hr className="home-areas-divider" />
          <ArtemisHero />
          {noticias.length > 0 && (
            <>
              <div className="home-news-grid" style={{ marginTop: '2rem' }}>
                {noticias.map((n) => (
                  <NoticiaCard key={n._id || n.url} noticia={n} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <Link to="/noticias" className="btn-outline">
                  <Newspaper size={15} /> Ver todas las noticias
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

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
