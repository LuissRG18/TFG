import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Loader2, AlertCircle } from 'lucide-react';
import ArticuloCard from '../components/ArticuloCard';
import SearchBar from '../components/SearchBar';
import type { Articulo } from '../types';
import { AREAS_CIENTIFICAS } from '../types';
import { buscarArxiv, buscarSemanticScholar, buscarCrossRef } from '../services/articulosService';

type Fuente = 'arxiv' | 'semanticscholar' | 'crossref';

const FUENTES: { id: Fuente; label: string }[] = [
  { id: 'arxiv', label: 'arXiv' },
  { id: 'semanticscholar', label: 'Semantic Scholar' },
  { id: 'crossref', label: 'CrossRef' },
];

const BuscarPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const areaParam = searchParams.get('area') || '';

  const [fuente, setFuente] = useState<Fuente>('arxiv');
  const [area, setArea] = useState(areaParam);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filtrosOpen, setFiltrosOpen] = useState(false);

  const buscar = useCallback(async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    try {
      const params = { q: query, area: area || undefined, pagina, limite: 10 };
      let result;
      if (fuente === 'arxiv') result = await buscarArxiv(params);
      else if (fuente === 'semanticscholar') result = await buscarSemanticScholar(params);
      else result = await buscarCrossRef(params);

      setArticulos(result.articulos);
      setTotal(result.total);
    } catch {
      setError('No se pudo conectar con la API. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [query, fuente, area, pagina]);

  useEffect(() => {
    setPagina(1);
  }, [query, fuente, area]);

  useEffect(() => {
    if (query) buscar();
  }, [buscar]);

  return (
    <div className="page-container">
      <div className="buscar-header">
        <SearchBar defaultValue={query} />
      </div>

      {/* Filtros */}
      <div className="buscar-filters-bar">
        {/* Fuentes */}
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

        <button
          onClick={() => setFiltrosOpen(!filtrosOpen)}
          className={`btn-outline-sm ${filtrosOpen ? 'active' : ''}`}
        >
          <SlidersHorizontal size={14} /> Filtros
        </button>
      </div>

      {filtrosOpen && (
        <div className="filtros-panel">
          <label className="filter-label">Área científica</label>
          <div className="filter-areas">
            <button
              onClick={() => setArea('')}
              className={`filter-btn ${!area ? 'active' : ''}`}
            >
              Todas
            </button>
            {AREAS_CIENTIFICAS.map((a) => (
              <button
                key={a.id}
                onClick={() => setArea(a.id)}
                className={`filter-btn ${area === a.id ? 'active' : ''}`}
              >
                {a.emoji} {a.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resultados */}
      {!query && (
        <div className="empty-state">
          <Search size={48} className="text-gray-300" />
          <p className="text-gray-400">Introduce un término para empezar a buscar</p>
        </div>
      )}

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
            <p className="results-count">
              {total.toLocaleString()} resultados para <strong>"{query}"</strong>
            </p>
          </div>
          <div className="articulos-list">
            {articulos.map((art) => (
              <ArticuloCard key={`${art.fuente}-${art.id}`} articulo={art} />
            ))}
          </div>
          {/* Paginación */}
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

      {!loading && !error && query && articulos.length === 0 && (
        <div className="empty-state">
          <Search size={48} className="text-gray-300" />
          <p className="text-gray-400">No se encontraron resultados para "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default BuscarPage;

