import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Search, Bookmark, BarChart2, Sparkles } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { AREAS_CIENTIFICAS } from '../types';
import { useAuth } from '../context/AuthContext';

import outerspacebackground from '../assets/outer-space-background.jpg';
import imgInformatica from '../assets/imgInformatica.jpg.jpg';
import imgMedicina from '../assets/imgMedicina.jpg.jpg';
import imgFisica from '../assets/imgFisica-jpg.png';
import imgBiologia from '../assets/imgBiologia.jpg.png';
import imgMatematicas from '../assets/imgMatematicas.jpg.png';
import imgQuimica from '../assets/imgQuimica.jpg.png';
import imgEconomia from '../assets/imgEconomia.jpg';
import imgPsicologia from '../assets/imgPsicologia.jpg';
import imgIngenieria from '../assets/imgIngenieria.jpg';
import imgAstronomia from '../assets/imgAstronomía.jpg';
import imgMedioAmbiente from '../assets/imgMedioAmbiente.jpg';
import imgNeurociencia from '../assets/imgNeurociencia.jpg';

const AREA_IMAGES: Record<string, string> = {
  cs: imgInformatica,
  medicine: imgMedicina,
  physics: imgFisica,
  biology: imgBiologia,
  mathematics: imgMatematicas,
  chemistry: imgQuimica,
  economics: imgEconomia,
  psychology: imgPsicologia,
  engineering: imgIngenieria,
  astronomy: imgAstronomia,
  environmental: imgMedioAmbiente,
  neuroscience: imgNeurociencia,
};

const TRENDING = [
  'inteligencia artificial', 'cambio climático', 'física cuántica',
  'CRISPR', 'machine learning', 'neurociencia',
];

const SERVICES = [
  {
    icon: <Search size={32} color="#fff" />,
    title: 'Busca & Explora',
    desc: 'Accede a millones de artículos científicos de arXiv, Semantic Scholar y CrossRef en una sola búsqueda unificada.',
    link: '/buscar',
    img: imgAstronomia,
  },
  {
    icon: <FlaskConical size={32} color="#fff" />,
    title: 'Modo Divulgativo',
    desc: 'Lee los abstracts en un lenguaje más accesible sin perder el rigor científico del artículo original.',
    link: '/buscar',
    img: imgMedicina,
  },
  {
    icon: <Bookmark size={32} color="#fff" />,
    title: 'Tus Favoritos',
    desc: 'Guarda los artículos que más te interesan, organízalos con etiquetas y añade notas personalizadas.',
    link: '/favoritos',
    img: imgPsicologia,
  },
  {
    icon: <BarChart2 size={32} color="#fff" />,
    title: 'Estadísticas',
    desc: 'Visualiza tu actividad científica con gráficos interactivos por área temática, año y fuente de datos.',
    link: '/estadisticas',
    img: imgMatematicas,
  },
];

const SOCIAL_AREAS = ['cs', 'biology', 'physics', 'engineering'];

const HomePage = () => {
  const { usuario } = useAuth();
  return (
    <div className="home-page">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero" style={{ backgroundImage: `url(${outerspacebackground})` }}>
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
            de arXiv y CrossRef al alcance de todos.
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
          {([<Search size={28} />, <Sparkles size={28} />, <Bookmark size={28} />, <BarChart2 size={28} />] as React.ReactNode[]).map((icon, i) => (
            <div key={i} className="hero-icon-bubble" style={{ animationDelay: `${i * 0.4}s` }}>
              {icon}
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────── */}
      <div className="stats-strip">
        <div className="stats-strip-inner">
          <div>
            <div className="stat-strip-number">10<span>M+</span></div>
            <div className="stat-strip-label">Artículos indexados</div>
          </div>
          <div>
            <div className="stat-strip-number">12</div>
            <div className="stat-strip-label">Áreas científicas</div>
          </div>
          <div>
            <div className="stat-strip-number">3</div>
            <div className="stat-strip-label">Fuentes de datos</div>
          </div>
        </div>
      </div>

      {/* ── SERVICIOS ────────────────────────────────────── */}
      <section className="section services-section">
        <div className="section-container">
          <p className="section-eyebrow">Qué ofrecemos</p>
          <div className="services-header">
            <h2 className="section-title-xl">Nuestros servicios</h2>
            <Link to="/buscar" className="btn-outline">Ver todo</Link>
          </div>
          <div className="services-grid">
            {SERVICES.map((s) => (
              <div key={s.title} className="service-card">
                <div className="service-card-visual">
                  <img src={s.img} alt={s.title} />
                  <div className="service-card-icon-overlay">{s.icon}</div>
                </div>
                <div className="service-card-body">
                  <h3 className="service-card-title">{s.title}</h3>
                  <p className="service-card-desc">{s.desc}</p>
                </div>
                <div className="service-card-footer">
                  <Link to={s.link} className="btn-dark-sm">Comenzar</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ÁREAS ───────────────────────────────────────── */}
      <section className="section areas-section">
        <div className="section-container">
          <div className="services-header">
            <div>
              <p className="section-eyebrow">Conocimiento especializado</p>
              <h2 className="section-title-xl">Explora por área</h2>
            </div>
            <Link to="/areas" className="btn-outline">Ver todas</Link>
          </div>
          <div className="areas-grid">
            {AREAS_CIENTIFICAS.map((area) => (
              <Link
                key={area.id}
                to={`/areas/${area.id}`}
                className="area-card"
              >
                <div className="area-card-cover">
                  <img src={AREA_IMAGES[area.id]} alt={area.label} className="area-card-img" />
                </div>
                <div className="area-card-body">
                  <span className="area-label">{area.label}</span>
                  <span className="area-explore">Explorar artículos →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOBRE SCILENS ────────────────────────────────── */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-image-wrapper">
            <img src={outerspacebackground} alt="Sobre SciLens" />
          </div>
          <div className="about-content">
            <p className="section-eyebrow">Sobre SciLens</p>
            <h2 className="section-title-xl">Más sobre nuestra plataforma</h2>
            <p className="about-text">
              SciLens nació con la misión de democratizar el acceso al conocimiento científico.
              Conectamos a millones de artículos de arXiv, CrossRef y Semantic Scholar, y los
              hacemos accesibles para estudiantes, investigadores y cualquier persona con curiosidad.
            </p>
            <p className="about-text">
              Con herramientas de búsqueda avanzada, comparación de papers, recomendaciones
              personalizadas y visualización de estadísticas, te ayudamos a navegar el vasto océano
              del conocimiento con facilidad y precisión.
            </p>
            <Link to="/registro" className="btn-dark" style={{ marginTop: '0.5rem', width: 'fit-content' }}>
              Comenzar ahora
            </Link>
          </div>
        </div>
      </section>

      {/* ── COLECCIONES / REDES ──────────────────────────── */}
      <section className="social-proof-section">
        <div className="social-proof-header">
          <p className="section-eyebrow">Nuestras colecciones</p>
          <h2 className="section-title-xl">Síguenos en nuestras áreas</h2>
          <p className="social-proof-desc">
            Millones de artículos curados de las mejores fuentes científicas del mundo, actualizados en tiempo real.
          </p>
        </div>
        <div className="social-proof-grid">
          {SOCIAL_AREAS.map((id) => (
            <Link key={id} to={`/areas/${id}`} className="social-proof-item">
              <img src={AREA_IMAGES[id]} alt={id} />
            </Link>
          ))}
        </div>
        <div className="flex justify-center">
          <Link to="/areas" className="btn-dark">Ver todas las áreas</Link>
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

