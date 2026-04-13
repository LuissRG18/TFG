import { useEffect, useState } from 'react';
import { ExternalLink, Rocket, Users, Clock, Globe } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
interface CrewMember {
  id: number;
  name: string;
  agency: string;
  role: string;
  image: string | null;
}

interface MissionData {
  name: string;
  description: string;
  launchDate: string | null;
  status: string;
  crew: CrewMember[];
  missionUrl: string | null;
}

// ── NASA Artemis 2 static facts (public domain, source: nasa.gov) ──────────
const NASA_FACTS = [
  { label: 'Destino', value: 'Órbita lunar distante' },
  { label: 'Vehículo', value: 'Orion + SLS Block 1' },
  { label: 'Duración prevista', value: '~10 días' },
  { label: 'Agencia', value: 'NASA / CSA' },
];

const NASA_ARTEMIS_NEWS = [
  {
    title: 'Artemis II: tripulación y misión — NASA',
    url: 'https://www.nasa.gov/humans-in-space/artemis/',
    source: 'nasa.gov',
  },
  {
    title: 'Detalles técnicos del cohete SLS Block 1 — NASA',
    url: 'https://www.nasa.gov/reference/space-launch-system/',
    source: 'nasa.gov',
  },
  {
    title: 'Cápsula Orion: sistemas y seguridad — NASA',
    url: 'https://www.nasa.gov/reference/orion-spacecraft/',
    source: 'nasa.gov',
  },
  {
    title: 'Programa Artemis: regreso a la Luna — NASA',
    url: 'https://www.nasa.gov/missions/artemis/',
    source: 'nasa.gov',
  },
];

// ── Image credit: NASA (public domain) ────────────────────────────────────
const ARTEMIS_IMAGE =
  'https://www.nasa.gov/wp-content/uploads/2023/09/artemis-ii-crew-1061.jpg';

// ── Component ──────────────────────────────────────────────────────────────
const ArtemisHero = () => {
  const [mission, setMission] = useState<MissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMission = async () => {
      try {
        // The Space Devs Launch Library 2 — free public API, no key required
        const res = await fetch(
          'https://ll.thespacedevs.com/2.3.0/launches/?search=Artemis+II&mode=detailed&limit=1',
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        const launch = data.results?.[0];

        if (!launch) throw new Error('No data');

        const crew: CrewMember[] = (launch.rocket?.spacecraft_stage?.launch_crew ?? []).map(
          (c: { id: number; astronaut?: { name?: string; agency?: { name?: string }; profile_image_thumbnail?: string }; role?: { role?: string } }) => ({
            id: c.id,
            name: c.astronaut?.name ?? 'Desconocido',
            agency: c.astronaut?.agency?.name ?? '',
            role: c.role?.role ?? '',
            image: c.astronaut?.profile_image_thumbnail ?? null,
          })
        );

        setMission({
          name: launch.name ?? 'Artemis II',
          description: launch.mission?.description ?? '',
          launchDate: launch.net ?? null,
          status: launch.status?.name ?? '',
          crew,
          missionUrl: launch.infoURLs?.[0]?.url ?? 'https://www.nasa.gov/missions/artemis/',
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
    return () => controller.abort();
  }, []);

  const formatDate = (iso: string | null) => {
    if (!iso) return 'Por confirmar';
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso));
  };

  return (
    <section className="artemis-hero">
      {/* ── Banner ── */}
      <div className="artemis-banner">
        <img
          src={ARTEMIS_IMAGE}
          alt="Tripulación Artemis II — Crédito: NASA (dominio público)"
          className="artemis-banner-img"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="artemis-banner-overlay" />
        <div className="artemis-banner-content">
          <span className="artemis-badge">
            <Rocket size={13} /> Misión activa
          </span>
          <h2 className="artemis-title">Artemis II</h2>
          <p className="artemis-subtitle">
            La primera misión tripulada al espacio profundo en más de 50 años.
            Cuatro astronautas orbitarán la Luna a bordo de la cápsula Orion.
          </p>
          {mission?.missionUrl && (
            <a
              href={mission.missionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="artemis-cta"
            >
              Ver misión oficial <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* ── Facts strip ── */}
      <div className="artemis-facts">
        {NASA_FACTS.map((f) => (
          <div key={f.label} className="artemis-fact">
            <span className="artemis-fact-label">{f.label}</span>
            <span className="artemis-fact-value">{f.value}</span>
          </div>
        ))}
        {mission?.launchDate && (
          <div className="artemis-fact">
            <span className="artemis-fact-label">
              <Clock size={11} className="inline mr-1" />Lanzamiento
            </span>
            <span className="artemis-fact-value">{formatDate(mission.launchDate)}</span>
          </div>
        )}
        {mission?.status && (
          <div className="artemis-fact">
            <span className="artemis-fact-label">
              <Globe size={11} className="inline mr-1" />Estado
            </span>
            <span className="artemis-fact-value">{mission.status}</span>
          </div>
        )}
      </div>

      <div className="artemis-body">
        {/* ── Crew ── */}
        <div className="artemis-section">
          <h3 className="artemis-section-title">
            <Users size={16} /> Tripulación
          </h3>

          {loading && (
            <p className="artemis-loading">Cargando datos de la misión…</p>
          )}

          {!loading && !error && mission && mission.crew.length > 0 && (
            <div className="artemis-crew-grid">
              {mission.crew.map((member) => (
                <div key={member.id} className="artemis-crew-card">
                  {member.image
                    ? <img src={member.image} alt={member.name} className="artemis-crew-img" />
                    : <div className="artemis-crew-avatar">{member.name[0]}</div>
                  }
                  <div>
                    <p className="artemis-crew-name">{member.name}</p>
                    <p className="artemis-crew-role">{member.role || member.agency}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fallback tripulación estática si la API no devuelve crew */}
          {!loading && (error || !mission || mission.crew.length === 0) && (
            <div className="artemis-crew-grid">
              {[
                { name: 'Reid Wiseman', role: 'Comandante — NASA' },
                { name: 'Victor Glover', role: 'Piloto — NASA' },
                { name: 'Christina Koch', role: 'Especialista — NASA' },
                { name: 'Jeremy Hansen', role: 'Especialista — CSA' },
              ].map((m) => (
                <div key={m.name} className="artemis-crew-card">
                  <div className="artemis-crew-avatar">{m.name[0]}</div>
                  <div>
                    <p className="artemis-crew-name">{m.name}</p>
                    <p className="artemis-crew-role">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── NASA links ── */}
        <div className="artemis-section">
          <h3 className="artemis-section-title">
            <ExternalLink size={16} /> Recursos oficiales NASA
          </h3>
          <ul className="artemis-news-list">
            {NASA_ARTEMIS_NEWS.map((item) => (
              <li key={item.url} className="artemis-news-item">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="artemis-news-link"
                >
                  <span className="artemis-news-source">{item.source}</span>
                  {item.title}
                  <ExternalLink size={12} className="artemis-news-icon" />
                </a>
              </li>
            ))}
          </ul>
          <p className="artemis-credit">
            Imágenes y datos: NASA — Dominio público.
            Datos de misión: <a href="https://thespacedevs.com" target="_blank" rel="noopener noreferrer">The Space Devs</a> (CC BY 4.0).
          </p>
        </div>
      </div>
    </section>
  );
};

export default ArtemisHero;
