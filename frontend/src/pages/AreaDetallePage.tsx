import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { AREAS_CIENTIFICAS } from '../types';
import type { Articulo } from '../types';
import ArticuloCard from '../components/ArticuloCard';
import { buscarArxiv, buscarCrossRef } from '../services/articulosService';

const AREA_QUERIES: Record<string, string> = {
  cs: 'computer science',
  medicine: 'medicine',
  physics: 'physics',
  biology: 'biology',
  mathematics: 'mathematics',
  chemistry: 'chemistry',
  economics: 'economics',
  psychology: 'psychology',
  engineering: 'engineering',
  astronomy: 'astronomy',
  environmental: 'environmental science',
  neuroscience: 'neuroscience',
};

const AREA_META: Record<string, { code: string; desc: string; count: string }> = {
  cs:            { code: 'CS',    desc: 'INFORMÁTICA · COMPUTER SCIENCE', count: '2.4M+' },
  medicine:      { code: 'MED',   desc: 'MEDICINA', count: '3.1M+' },
  physics:       { code: 'PHY',   desc: 'FÍSICA · PHYSICS', count: '1.8M+' },
  biology:       { code: 'BIO',   desc: 'BIOLOGÍA · BIOLOGY', count: '2.0M+' },
  mathematics:   { code: 'MATH',  desc: 'MATEMÁTICAS · MATHEMATICS', count: '900K+' },
  chemistry:     { code: 'CHEM',  desc: 'QUÍMICA · CHEMISTRY', count: '1.2M+' },
  economics:     { code: 'ECON',  desc: 'ECONOMÍA · ECONOMICS', count: '700K+' },
  psychology:    { code: 'PSY',   desc: 'PSICOLOGÍA · PSYCHOLOGY', count: '850K+' },
  engineering:   { code: 'ENG',   desc: 'INGENIERÍA · ENGINEERING', count: '1.5M+' },
  astronomy:     { code: 'ASTR',  desc: 'ASTRONOMÍA · ASTRONOMY', count: '600K+' },
  environmental: { code: 'ENV',   desc: 'MEDIO AMBIENTE · ENVIRONMENTAL SCIENCE', count: '750K+' },
  neuroscience:  { code: 'NEURO', desc: 'NEUROCIENCIA · NEUROSCIENCE', count: '950K+' },
};

type Fuente = 'arxiv' | 'crossref';

const FUENTES: { id: Fuente; label: string }[] = [
  { id: 'arxiv', label: 'arXiv' },
  { id: 'crossref', label: 'CrossRef' },
];

const AreaDetallePage = () => {
  const { areaId } = useParams<{ areaId: string }>();
  const area = AREAS_CIENTIFICAS.find((a) => a.id === areaId);
  const meta = areaId ? (AREA_META[areaId] ?? { code: areaId.toUpperCase(), desc: areaId.toUpperCase(), count: '' }) : null;

  const [fuente, setFuente] = useState<Fuente>('arxiv');
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const buscar = useCallback(async () => {
    if (!areaId) return;
    setLoading(true);
    setError('');
    try {
      const limite = 10;
      const params = { q: AREA_QUERIES[areaId] ?? areaId, area: areaId, pagina, limite };
      let result;
      if (fuente === 'arxiv') result = await buscarArxiv(params);
      else result = await buscarCrossRef(params);
      setArticulos(result.articulos);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo conectar con la API.');
    } finally {
      setLoading(false);
    }
  }, [areaId, fuente, pagina]);

  useEffect(() => { setPagina(1); }, [areaId, fuente]);
  useEffect(() => { buscar(); }, [buscar]);

  if (!area || !meta) {
    return (
      <div className="page-container">
        <p>Área no encontrada.</p>
        <Link to="/areas" className="btn-outline">Volver a áreas</Link>
      </div>
    );
  }

  return (
    <div className="area-detail-page">
      {/*Header*/}
      <div className="area-detail-header">
        <div className="area-detail-header-inner">
          <nav className="area-detail-breadcrumb">
            <Link to="/">Inicio</Link>
            <span>/</span>
            <Link to="/areas">Áreas</Link>
            <span>/</span>
            <span>{area.label}</span>
          </nav>
          <p className="area-detail-eyebrow">{meta.code} Â· {meta.desc.split('Â·')[1]?.trim() ?? meta.desc}</p>
          <h1 className="area-detail-title">{area.label}</h1>
          <p className="area-detail-count">
            {!loading && total > 0
              ? <>{total.toLocaleString()} artículos <span className="area-detail-delta">+2.1K esta semana</span></>
              : meta.count + ' artículos en catálogo'
            }
          </p>
        </div>
      </div>

      {/* Source switcher */}
      <div className="area-detail-source-bar">
        <div className="area-detail-source-inner">
          {FUENTES.map((f) => (
            <button
              key={f.id}
              onClick={() => setFuente(f.id)}
              className={`source-tab ${fuente === f.id ? 'active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="area-detail-content">
        {loading && (
          <div className="loading-state">
            <Loader2 size={32} className="animate-spin" />
            <p>Buscando artículos…</p>
          </div>
        )}

        {error && <div className="error-banner"><AlertCircle size={18} /> {error}</div>}

        {!loading && !error && articulos.length > 0 && (
          <>
            <div className="journal-list">
              {articulos.map((art) => (
                <ArticuloCard key={`${art.fuente}-${art.id}`} articulo={art} variant="journal" />
              ))}
            </div>
            <div className="pagination">
              <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1} className="btn-outline-sm">← Anterior</button>
              <span className="pagination-info">Página {pagina}</span>
              <button onClick={() => setPagina((p) => p + 1)} disabled={articulos.length < 10} className="btn-outline-sm">Siguiente →</button>
            </div>
          </>
        )}

        {!loading && !error && articulos.length === 0 && (
          <div className="empty-state"><p>No se encontraron artículos.</p></div>
        )}
      </div>
    </div>
  );
};

export default AreaDetallePage;
