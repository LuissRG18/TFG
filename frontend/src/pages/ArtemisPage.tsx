import { Link } from 'react-router-dom';
import { Rocket, Users, FlaskConical, Star, Globe, ExternalLink, ChevronRight } from 'lucide-react';

import imgArtemis2 from '../assets/imgArtemis2.webp';
import imgCrew from '../assets/artemisiicrewposterorig-notext-01.webp';

// ── Tripulación ────────────────────────────────────────────────────────────
const CREW = [
  {
    name: 'Reid Wiseman',
    role: 'Comandante',
    agency: 'NASA',
    bio: 'Capitán de la Marina de EE.UU. y veterano de la ISS. Liderará la misión con más de 165 días de experiencia en el espacio.',
    initials: 'RW',
  },
  {
    name: 'Victor Glover',
    role: 'Piloto',
    agency: 'NASA',
    bio: 'Piloto de caza naval y primer astronauta afroamericano en residir a largo plazo en la ISS durante la misión Crew-1.',
    initials: 'VG',
  },
  {
    name: 'Christina Koch',
    role: 'Especialista de misión',
    agency: 'NASA',
    bio: 'Poseedora del récord de la estancia continua más larga de una mujer en el espacio (328 días). Será la primera mujer en viajar a la Luna.',
    initials: 'CK',
  },
  {
    name: 'Jeremy Hansen',
    role: 'Especialista de misión',
    agency: 'CSA (Canadá)',
    bio: 'Coronel de la Fuerza Aérea canadiense. Será el primer canadiense en viajar más allá de la órbita terrestre baja.',
    initials: 'JH',
  },
];

// ── Curiosidades ───────────────────────────────────────────────────────────
const CURIOSIDADES = [
  {
    icon: <Star size={20} />,
    title: '50 años después',
    text: 'Artemis II marcará el primer viaje humano al espacio profundo desde la misión Apollo 17 en diciembre de 1972, cerrando una brecha de más de 50 años.',
  },
  {
    icon: <Globe size={20} />,
    title: 'Sin aterrizar, pero cerca',
    text: 'La misión no aterrizará en la Luna, sino que realizará una trayectoria de libre retorno, acercándose a unos 8.900 km de la superficie lunar. Será el ensayo general para Artemis III, que sí aterrizará.',
  },
  {
    icon: <Rocket size={20} />,
    title: 'El cohete más potente',
    text: 'El Sistema de Lanzamiento Espacial (SLS) Block 1 genera 39,1 MN de empuje, superando al Saturn V en potencia en el despegue. Es el cohete más poderoso jamás construido con éxito.',
  },
  {
    icon: <FlaskConical size={20} />,
    title: 'Orion, 21 días en el espacio',
    text: 'La cápsula Orion ha sido diseñada para soportar la radiación del espacio profundo y las temperaturas extremas de la reentrada (2.760 °C), aguantando hasta 21 días con la tripulación a bordo.',
  },
  {
    icon: <Users size={20} />,
    title: 'Un equipo histórico',
    text: 'Por primera vez, una mujer (Christina Koch) y un canadiense (Jeremy Hansen) viajarán más allá de la órbita terrestre baja, hitos que redefinen quiénes pueden explorar el espacio profundo.',
  },
  {
    icon: <Star size={20} />,
    title: 'La trayectoria de la Luna',
    text: 'La cápsula alcanzará una velocidad de aproximadamente 11 km/s al regresar a la atmósfera terrestre, convirtiendo energía cinética en calor a través del escudo térmico de ablación más grande jamás volado.',
  },
];

// ── Línea de tiempo ────────────────────────────────────────────────────────
const TIMELINE = [
  { year: '2022', event: 'Artemis I', desc: 'Vuelo de prueba no tripulado de Orion y SLS. La cápsula viajó 450.000 km desde la Tierra, pasó por detrás de la Luna y regresó con éxito.' },
  { year: '2025', event: 'Artemis II listo', desc: 'Integración de Orion y SLS en el VAB (Vehicle Assembly Building) del Centro Espacial Kennedy. Entrenamiento final de la tripulación.' },
  { year: '2026', event: 'Artemis II', desc: 'Lanzamiento tripulado. Cuatro astronautas rodean la Luna en una trayectoria de libre retorno y regresan a la Tierra tras ~10 días.' },
  { year: '2027+', event: 'Artemis III', desc: 'Primer alunizaje desde Apollo 17. Una mujer pisará la superficie lunar por primera vez en la historia.' },
];

// ── Datos técnicos ─────────────────────────────────────────────────────────
const SPECS = [
  { label: 'Cohete', value: 'SLS Block 1' },
  { label: 'Cápsula', value: 'Orion MPCV' },
  { label: 'Empuje (despegue)', value: '39,1 MN' },
  { label: 'Distancia a la Luna', value: '~384.400 km' },
  { label: 'Velocidad máxima', value: '~11 km/s (reentrada)' },
  { label: 'Duración', value: '~10 días' },
  { label: 'Tripulantes', value: '4' },
  { label: 'Agencias', value: 'NASA / CSA' },
];

// ── Component ──────────────────────────────────────────────────────────────
const ArtemisPage = () => (
  <div className="artemis-page">

    {/* ── HERO ── */}
    <div
      className="artemis-page-hero"
      style={{ backgroundImage: `url(${imgArtemis2})` }}
    >
      <div className="artemis-page-hero-overlay" />
      <div className="artemis-page-hero-content">
        <div className="artemis-page-breadcrumb">
          <Link to="/">Inicio</Link>
          <ChevronRight size={13} />
          <span>Artemis II</span>
        </div>
        <span className="artemis-page-badge"><Rocket size={12} /> Misión activa · NASA</span>
        <h1 className="artemis-page-hero-title">Artemis II</h1>
        <p className="artemis-page-hero-sub">
          El regreso de la humanidad a la Luna. Cuatro astronautas, una cápsula Orion
          y el cohete más potente jamás construido.
        </p>
        <a
          href="https://www.nasa.gov/missions/artemis/"
          target="_blank"
          rel="noopener noreferrer"
          className="artemis-page-hero-cta"
        >
          Ver misión oficial en NASA.gov <ExternalLink size={13} />
        </a>
      </div>
    </div>

    <div className="artemis-page-body">

      {/* ── RESUMEN ── */}
      <section className="artemis-page-section artemis-page-summary">
        <div className="artemis-page-summary-text">
          <h2 className="artemis-page-section-title">La misión</h2>
          <p>
            Artemis II es la segunda misión del programa Artemis de la NASA y la primera en llevar
            tripulación. Cuatro astronautas —Reid Wiseman, Victor Glover, Christina Koch y Jeremy
            Hansen— abordarán la cápsula Orion, lanzada por el cohete SLS (Space Launch System),
            para realizar una trayectoria de libre retorno alrededor de la Luna.
          </p>
          <p>
            A diferencia de las misiones Apollo, Artemis no utilizará un módulo lunar en esta fase.
            El objetivo principal es validar todos los sistemas de Orion con seres humanos a bordo
            en el entorno de radiación del espacio profundo: una especie de ensayo general para
            Artemis III, que sí contempla el alunizaje.
          </p>
          <p>
            La misión durará aproximadamente diez días. La trayectoria llevará a la tripulación a
            unos 8.900 km de la superficie lunar, la mayor distancia a la que humanos habrán estado
            de la Tierra desde Apollo 13 en 1970. Al regresar, Orion realizará una reentrada
            atmosférica a velocidades superiores a 11 km/s, con temperaturas en el escudo térmico
            que superarán los 2.700 °C.
          </p>
        </div>
        <div className="artemis-page-specs-grid">
          {SPECS.map((s) => (
            <div key={s.label} className="artemis-page-spec">
              <span className="artemis-page-spec-label">{s.label}</span>
              <span className="artemis-page-spec-value">{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRIPULACIÓN ── */}
      <section className="artemis-page-section">
        <h2 className="artemis-page-section-title"><Users size={20} className="inline mr-2" />La tripulación</h2>
        <div className="artemis-page-crew-banner">
          <img src={imgCrew} alt="Tripulación Artemis II — Crédito: NASA (dominio público)" />
          <p className="artemis-page-img-credit">Crédito: NASA — Dominio público</p>
        </div>
        <div className="artemis-page-crew-grid">
          {CREW.map((m) => (
            <div key={m.name} className="artemis-page-crew-card">
              <div className="artemis-page-crew-avatar">{m.initials}</div>
              <div>
                <p className="artemis-page-crew-name">{m.name}</p>
                <p className="artemis-page-crew-role">{m.role} · <span>{m.agency}</span></p>
                <p className="artemis-page-crew-bio">{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CURIOSIDADES ── */}
      <section className="artemis-page-section">
        <h2 className="artemis-page-section-title"><Star size={20} className="inline mr-2" />Curiosidades</h2>
        <div className="artemis-page-curiosidades-grid">
          {CURIOSIDADES.map((c) => (
            <div key={c.title} className="artemis-page-curiosidad">
              <div className="artemis-page-curiosidad-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LÍNEA DE TIEMPO ── */}
      <section className="artemis-page-section">
        <h2 className="artemis-page-section-title"><Rocket size={20} className="inline mr-2" />Línea de tiempo del programa Artemis</h2>
        <div className="artemis-page-timeline">
          {TIMELINE.map((t, i) => (
            <div key={t.year} className={`artemis-page-timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
              <div className="artemis-page-timeline-dot" />
              <div className="artemis-page-timeline-card">
                <span className="artemis-page-timeline-year">{t.year}</span>
                <h3>{t.event}</h3>
                <p>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA hacia artículos ── */}
      <section className="artemis-page-cta">
        <h2>¿Quieres profundizar en la ciencia?</h2>
        <p>Explora los artículos científicos más recientes sobre astronomía, misiones espaciales y exploración lunar.</p>
        <div className="artemis-page-cta-buttons">
          <Link to="/areas/astronomy" className="artemis-home-btn-primary">
            Explorar artículos de astronomía
          </Link>
          <a
            href="https://www.nasa.gov/missions/artemis/"
            target="_blank"
            rel="noopener noreferrer"
            className="artemis-home-btn-ghost"
            style={{ color: 'var(--text)', borderColor: 'var(--border)', background: 'var(--bg-mid)' }}
          >
            Ver en NASA.gov <ExternalLink size={13} />
          </a>
        </div>
        <p className="artemis-page-credit">Contenido de divulgación elaborado por SciLens. Imágenes: NASA (dominio público).</p>
      </section>

    </div>
  </div>
);

export default ArtemisPage;
