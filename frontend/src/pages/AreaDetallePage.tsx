import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { AREAS_CIENTIFICAS } from '../types';
import type { Articulo } from '../types';
import ArticuloCard from '../components/ArticuloCard';
import { buscarArxiv, buscarCrossRef } from '../services/articulosService';

import imgInformatica from '../assets/imgInformatica.jpg.jpg';
import imgMedicina from '../assets/imgMedicina.jpg.jpg';
import imgFisica from '../assets/imgFisica-jpg.png';
import imgBiologia from '../assets/imgBiologia.jpg.png';
import imgMatematicas from '../assets/imgMatematicas.jpg.png';
import imgQuimica from '../assets/imgQuimica.jpg.png';
import imgEconomia from '../assets/imgEconomia.jpg';
import imgPsicologia from '../assets/imgPsicologia.jpg';

const AREA_IMAGES: Record<string, string> = {
  cs: imgInformatica,
  medicine: imgMedicina,
  physics: imgFisica,
  biology: imgBiologia,
  mathematics: imgMatematicas,
  chemistry: imgQuimica,
  economics: imgEconomia,
  psychology: imgPsicologia,
};

const AREA_QUERIES: Record<string, string> = {
  cs: 'computer science',
  medicine: 'medicine',
  physics: 'physics',
  biology: 'biology',
  mathematics: 'mathematics',
  chemistry: 'chemistry',
  economics: 'economics',
  psychology: 'psychology',
};

type Fuente = 'arxiv' | 'crossref';

const FUENTES: { id: Fuente; label: string }[] = [
  { id: 'arxiv', label: 'arXiv' },
  { id: 'crossref', label: 'CrossRef' },
];

const AreaDetallePage = () => {
  const { areaId } = useParams<{ areaId: string }>();
  const area = AREAS_CIENTIFICAS.find((a) => a.id === areaId);

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
    } catch (err: any) {
      setError(err.message || 'No se pudo conectar con la API. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [areaId, fuente, pagina]);

  useEffect(() => {
    setPagina(1);
  }, [areaId, fuente]);

  useEffect(() => {
    buscar();
  }, [buscar]);

  if (!area) {
    return (
      <div className="page-container">
        <p>Área no encontrada.</p>
        <Link to="/areas" className="btn-primary-sm" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          ← Volver a áreas
        </Link>
      </div>
    );
  }

  const bannerImg = AREA_IMAGES[area.id];

  return (
    <div>
      {/* ── Hero banner ── */}
      <div
        className="area-detail-hero"
        style={bannerImg ? { backgroundImage: `url(${bannerImg})` } : {}}
      >
        <div className="area-detail-hero-overlay" />
        <div className="area-detail-hero-content">
          <Link to="/areas" className="area-back-link">← Todas las áreas</Link>
          <h1 className="area-detail-title">{area.label}</h1>
          <p className="area-detail-subtitle">
            Últimas publicaciones e investigaciones en {area.label.toLowerCase()}
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="page-container" style={{ paddingTop: '2rem' }}>
        {/* Source switcher */}
        <div className="buscar-filters-bar">
          <div className="filter-group">
            {FUENTES.map((f) => (
              <button
                key={f.id}
                onClick={() => setFuente(f.id)}
                className={`filter-btn ${fuente === f.id ? 'active' : ''}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="loading-state">
            <Loader2 size={32} className="animate-spin text-indigo-500" />
            <p className="text-gray-400">Buscando artículos...</p>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {!loading && !error && articulos.length > 0 && (
          <>
            <div className="results-header">
              <p className="results-count">{total.toLocaleString()} artículos encontrados</p>
            </div>
            <div className="articulos-grid">
              {articulos.map((art) => (
                <ArticuloCard key={`${art.fuente}-${art.id}`} articulo={art} />
              ))}
            </div>
            <div className="pagination">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="btn-outline-sm"
              >
                ← Anterior
              </button>
              <span className="pagination-info">Página {pagina}</span>
              <button
                onClick={() => setPagina((p) => p + 1)}
                disabled={articulos.length < 10}
                className="btn-outline-sm"
              >
                Siguiente →
              </button>
            </div>
          </>
        )}

        {!loading && !error && articulos.length === 0 && (
          <div className="empty-state">
            <p className="text-gray-400">No se encontraron artículos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaDetallePage;
