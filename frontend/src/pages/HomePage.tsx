import React, { useRef, useEffect } from 'react';
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
import logodescilens from '../assets/Logo de SciLens.png';

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
    icon: <Search size={26} color="#fff" />,
    title: 'Busca & Explora',
    desc: 'Accede a millones de artículos científicos de arXiv y CrossRef en una sola búsqueda unificada.',
    link: '/buscar',
  },
  {
    icon: <FlaskConical size={26} color="#fff" />,
    title: 'Modo Divulgativo',
    desc: 'Lee los abstracts en un lenguaje más accesible sin perder el rigor científico del artículo original.',
    link: '/buscar',
  },
  {
    icon: <Bookmark size={26} color="#fff" />,
    title: 'Tus Favoritos',
    desc: 'Guarda los artículos que más te interesan, organízalos con etiquetas y añade notas personalizadas.',
    link: '/favoritos',
  },
  {
    icon: <BarChart2 size={26} color="#fff" />,
    title: 'Estadísticas',
    desc: 'Visualiza tu actividad científica con gráficos interactivos por área temática, año y fuente de datos.',
    link: '/estadisticas',
  },
];



const AreasMarquee = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;
    const tick = () => {
      if (!pausedRef.current) {
        wrapper.scrollLeft += 0.7;
        if (wrapper.scrollLeft >= track.scrollWidth / 2) {
          wrapper.scrollLeft = 0;
        }
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const doubled = [...AREAS_CIENTIFICAS, ...AREAS_CIENTIFICAS];

  return (
    <div className="areas-marquee-outer">
      <div
        className="areas-marquee-wrapper"
        ref={wrapperRef}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => {
          pausedRef.current = false;
          isDragging.current = false;
          wrapperRef.current?.classList.remove('is-dragging');
        }}
        onMouseDown={(e) => {
          isDragging.current = true;
          pausedRef.current = true;
          dragStartX.current = e.clientX;
          dragScrollLeft.current = wrapperRef.current?.scrollLeft ?? 0;
          wrapperRef.current?.classList.add('is-dragging');
        }}
        onMouseMove={(e) => {
          if (!isDragging.current || !wrapperRef.current) return;
          e.preventDefault();
          const dx = e.clientX - dragStartX.current;
          wrapperRef.current.scrollLeft = dragScrollLeft.current - dx;
        }}
        onMouseUp={() => {
          isDragging.current = false;
          pausedRef.current = false;
          wrapperRef.current?.classList.remove('is-dragging');
        }}
        onTouchStart={() => { pausedRef.current = true; }}
        onTouchEnd={() => { pausedRef.current = false; }}
      >
        <div className="areas-marquee-track" ref={trackRef}>
          {doubled.map((area, i) => (
            <a
              key={`${area.id}-${i}`}
              href={`/areas/${area.id}`}
              className="area-card"
              onClick={(e) => { if (isDragging.current) e.preventDefault(); }}
            >
              <div className="area-card-cover">
                <img src={AREA_IMAGES[area.id]} alt={area.label} className="area-card-img" />
              </div>
              <div className="area-card-body">
                <span className="area-label">{area.label}</span>
                <span className="area-explore">Explorar artículos →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

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
        
        {/* ── SOBRE SCILENS ────────────────────────────────── */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-image-wrapper">
            <img src={logodescilens} alt="Sobre SciLens" />
          </div>
          <div className="about-content">
            <p className="section-eyebrow">Sobre SciLens</p>
            <h2 className="section-title-xl">Más sobre nuestra plataforma</h2>
            <p className="about-text">
              SciLens nació con la misión de aglomerar el acceso al conocimiento científico.
              Conectamos a millones de artículos de arXiv y CrossRef, y los
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

      {/* ── SERVICIOS ────────────────────────────────────── */}
      <section className="section services-section">
        <div className="section-container">
          <p className="section-eyebrow">Qué ofrecemos</p>
          <div className="services-header">
            <h2 className="section-title-xl">Nuestros servicios</h2>
            {/* <Link to="/buscar" className="btn-outline">Ver todo</Link> */}
          </div>
          <div className="services-grid">
            {SERVICES.map((s) => (
              <div key={s.title} className="service-card">
                <div className="service-card-icon">{s.icon}</div>
                <div className="service-card-body">
                  <h3 className="service-card-title">{s.title}</h3>
                  <p className="service-card-desc">{s.desc}</p>
                </div>
                {/* <div className="service-card-footer">
                  <Link to={s.link} className="btn-dark-sm">Comenzar</Link>
                </div> */}
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
        </div>
        <AreasMarquee />
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

