import { Link } from 'react-router-dom';
import { FlaskConical, Search, Bookmark, BarChart2, ArrowRight, Atom, Brain, Dna, Calculator } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { AREAS_CIENTIFICAS } from '../types';

const TRENDING = [
  'inteligencia artificial', 'cambio climático', 'física cuántica',
  'CRISPR', 'machine learning', 'neurociencia',
];

const FEATURES = [
  {
    icon: <Search size={24} className="text-indigo-500" />,
    title: 'Busca & Explora',
    desc: 'Accede a millones de artículos científicos de arXiv, Semantic Scholar y CrossRef en una sola búsqueda.',
  },
  {
    icon: <FlaskConical size={24} className="text-emerald-500" />,
    title: 'Modo Divulgativo',
    desc: 'Lee los abstracts en un lenguaje más accesible, sin perder el rigor científico.',
  },
  {
    icon: <Bookmark size={24} className="text-amber-500" />,
    title: 'Tus Favoritos',
    desc: 'Guarda los artículos que más te interesan y organízalos con etiquetas y notas.',
  },
  {
    icon: <BarChart2 size={24} className="text-rose-500" />,
    title: 'Estadísticas',
    desc: 'Visualiza tu actividad científica con gráficos interactivos por área, año y fuente.',
  },
];

const SCIENCE_ICONS = [
  <Atom size={32} className="text-indigo-400" />,
  <Brain size={32} className="text-purple-400" />,
  <Dna size={32} className="text-emerald-400" />,
  <Calculator size={32} className="text-amber-400" />,
];

const HomePage = () => {
  return (
    <div className="home-page">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-badge">
            <FlaskConical size={14} />
            Explorador científico open-access
          </div>
          <h1 className="hero-title">
            Descubre la ciencia<br />
            <span className="gradient-text">que cambia el mundo</span>
          </h1>
          <p className="hero-subtitle">
            Busca, comprende y guarda artículos científicos reales. Millones de papers
            de arXiv, Semantic Scholar y CrossRef al alcance de todos.
          </p>
          <div className="hero-search">
            <SearchBar size="lg" placeholder="¿Qué quieres explorar hoy?" />
          </div>
          <div className="hero-trending">
            <span className="trending-label">Tendencias:</span>
            {TRENDING.map((t) => (
              <Link key={t} to={`/buscar?q=${encodeURIComponent(t)}`} className="trending-tag">
                {t}
              </Link>
            ))}
          </div>
        </div>
        <div className="hero-icons">
          {SCIENCE_ICONS.map((icon, i) => (
            <div key={i} className="hero-icon-bubble" style={{ animationDelay: `${i * 0.4}s` }}>
              {icon}
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────── */}
      <section className="section features-section">
        <div className="section-container">
          <h2 className="section-title">Todo lo que necesitas</h2>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ÁREAS ───────────────────────────────────────── */}
      <section className="section areas-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Explora por área</h2>
            <Link to="/areas" className="btn-link">Ver todas <ArrowRight size={14} /></Link>
          </div>
          <div className="areas-grid">
            {AREAS_CIENTIFICAS.slice(0, 6).map((area) => (
              <Link
                key={area.id}
                to={`/buscar?q=${encodeURIComponent(area.label)}&area=${area.id}`}
                className="area-card"
              >
                <span className="area-emoji">{area.emoji}</span>
                <span className="area-label">{area.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="section cta-section">
        <div className="cta-card">
          <h2 className="cta-title">Empieza a explorar ahora</h2>
          <p className="cta-desc">Crea una cuenta gratuita para guardar tus favoritos y ver tus estadísticas.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/registro" className="btn-primary">Crear cuenta gratis</Link>
            <Link to="/buscar" className="btn-outline">Explorar sin registrarse</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

