import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ArticuloCard from '../components/ArticuloCard';
import type { Articulo } from '../types';
import { AREAS_CIENTIFICAS } from '../types';
import { useAuth } from '../context/AuthContext';
import { buscarArxiv } from '../services/articulosService';

const AREA_QUERIES_EN: Record<string, string> = {
  cs: 'computer science', physics: 'physics', mathematics: 'mathematics',
  biology: 'biology', medicine: 'medicine', chemistry: 'chemistry',
  economics: 'economics', psychology: 'psychology', engineering: 'engineering',
  astronomy: 'astronomy', environmental: 'environmental science', neuroscience: 'neuroscience',
};

const AREA_CODES: Record<string, string> = {
  cs: 'CS', medicine: 'MED', physics: 'PHY', biology: 'BIO', mathematics: 'MATH',
  chemistry: 'CHEM', economics: 'ECON', psychology: 'PSY', engineering: 'ENG',
  astronomy: 'ASTR', environmental: 'ENV', neuroscience: 'NEURO',
};

interface AreaGroup {
  areaId: string;
  label: string;
  articulos: Articulo[];
  loading: boolean;
}

const RecomendacionesPage = () => {
  const { usuario } = useAuth();
  const [groups, setGroups] = useState<AreaGroup[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const areasUsuario = usuario?.areasInteres ?? [];
  const areasEfectivas = areasUsuario.length > 0
    ? AREAS_CIENTIFICAS.filter((a) => areasUsuario.includes(a.id))
    : AREAS_CIENTIFICAS.slice(0, 4);

  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    // Initialize groups with loading state
    const initial: AreaGroup[] = areasEfectivas.map((a) => ({
      areaId: a.id, label: a.label, articulos: [], loading: true,
    }));
    setGroups(initial);

    // Fetch each area independently
    areasEfectivas.forEach((area) => {
      const query = AREA_QUERIES_EN[area.id] ?? area.id;
      buscarArxiv({ q: query, area: area.id, limite: 3 })
        .then((res) => {
          setGroups((prev) =>
            prev.map((g) => g.areaId === area.id ? { ...g, articulos: res.articulos, loading: false } : g)
          );
        })
        .catch(() => {
          setGroups((prev) =>
            prev.map((g) => g.areaId === area.id ? { ...g, loading: false } : g)
          );
          setGlobalError('Algunas áreas no se pudieron cargar.');
        });
    });
  }, []);

  return (
    <div className="recom-page">
      <div className="recom-page-header">
        <div className="recom-page-header-inner">
          <p className="section-eyebrow">PARA TI</p>
          <h1 className="recom-page-title">Recomendaciones</h1>
          <p className="recom-page-sub">
            Artículos recientes basados en {areasUsuario.length > 0 ? 'tus áreas de interés' : 'áreas populares'}
          </p>
        </div>
      </div>

      <div className="recom-page-content">
        {globalError && <div className="error-banner" style={{ marginBottom: '1rem' }}>{globalError}</div>}

        {!usuario && (
          <div className="recom-tip-banner">
            <strong>Consejo:</strong> Configura tus áreas de interés en tu{' '}
            <Link to="/perfil">perfil</Link> para recibir recomendaciones personalizadas.
          </div>
        )}

        {groups.map((group) => (
          <section key={group.areaId} className="recom-group">
            <div className="recom-group-header">
              <span className="recom-group-code">{AREA_CODES[group.areaId] ?? group.areaId.toUpperCase()}</span>
              <h2 className="recom-group-name">{group.label}</h2>
              {!group.loading && <span className="recom-group-count">{group.articulos.length} artículos</span>}
              <Link to={`/areas/${group.areaId}`} className="recom-group-link">Ver todas →</Link>
            </div>

            {group.loading ? (
              <div className="recom-group-loading"><Loader2 size={20} className="animate-spin" /></div>
            ) : group.articulos.length > 0 ? (
              <div className="recom-group-cards">
                {group.articulos.map((art) => (
                  <ArticuloCard key={`${art.fuente}-${art.id}`} articulo={art} />
                ))}
              </div>
            ) : (
              <p className="recom-group-empty">No se encontraron artículos para esta área.</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default RecomendacionesPage;
