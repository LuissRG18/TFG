import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Loader2, AlertCircle } from 'lucide-react';
import ArticuloCard from '../components/ArticuloCard';
import SearchBar from '../components/SearchBar';
import type { Articulo } from '../types';
import { AREAS_CIENTIFICAS } from '../types';
import { buscarArxiv, buscarCrossRef } from '../services/articulosService';
import { guardarBusqueda } from '../services/favoritosService';
import { useAuth } from '../context/AuthContext';

type Fuente = 'arxiv' | 'crossref';
type Orden = 'relevancia' | 'anio' | 'citas';

const FUENTES: { id: Fuente; label: string }[] = [
  { id: 'arxiv', label: 'arXiv' },
  { id: 'crossref', label: 'CrossRef' },
];

const BuscarPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const areaParam = searchParams.get('area') || '';
  const { usuario } = useAuth();

  const [fuente, setFuente] = useState<Fuente>('arxiv');
  const [area, setArea] = useState(areaParam);
  const [anioDesde, setAnioDesde] = useState('');
  const [anioHasta, setAnioHasta] = useState('');
  const [minCitas, setMinCitas] = useState('');
  const [autorFiltro, setAutorFiltro] = useState('');
  const [orden, setOrden] = useState<Orden>('relevancia');
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
      const limite = 10;
      const params = {
        q: query,
        area: area || undefined,
        pagina,
        limite,
        anioDesde: anioDesde ? Number(anioDesde) : undefined,
        anioHasta: anioHasta ? Number(anioHasta) : undefined,
        minCitas: minCitas ? Number(minCitas) : undefined,
        autor: autorFiltro || undefined,
        orden,
      };
      let result;
      if (fuente === 'arxiv') result = await buscarArxiv(params);
      else result = await buscarCrossRef(params);

      let arts = result.articulos;

      // Client-side filters for fields the APIs don't natively support
      if (anioDesde) arts = arts.filter((a) => (a.anio ?? 0) >= Number(anioDesde));
      if (anioHasta) arts = arts.filter((a) => (a.anio ?? 9999) <= Number(anioHasta));
      if (minCitas) arts = arts.filter((a) => (a.citaciones ?? 0) >= Number(minCitas));
      if (orden === 'anio') arts = [...arts].sort((a, b) => (b.anio ?? 0) - (a.anio ?? 0));
      if (orden === 'citas') arts = [...arts].sort((a, b) => (b.citaciones ?? 0) - (a.citaciones ?? 0));

      setArticulos(arts);
      setTotal(result.total);

      // Save search to historial if logged in
      if (usuario) {
        guardarBusqueda({ termino: query, fuente, area: area || undefined, resultados: arts.length })
          .catch(() => {/* silent */});
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo conectar con la API.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [query, fuente, area, anioDesde, anioHasta, minCitas, autorFiltro, orden, pagina, usuario]);

  useEffect(() => {
    setPagina(1);
  }, [query, fuente, area, anioDesde, anioHasta, minCitas, autorFiltro, orden]);

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
          {/* Ãrea cientÃ­fica */}
          <div className="filter-section">
            <label className="filter-label">Ãrea cientÃ­fica</label>
            <div className="filter-areas">
              <button onClick={() => setArea('')} className={`filter-btn ${!area ? 'active' : ''}`}>Todas</button>
              {AREAS_CIENTIFICAS.map((a) => (
                <button key={a.id} onClick={() => setArea(a.id)} className={`filter-btn ${area === a.id ? 'active' : ''}`}>
                  {a.emoji} {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rango de aÃ±os */}
          <div className="filter-section">
            <label className="filter-label">Rango de aÃ±os</label>
            <div className="flex gap-2 items-center flex-wrap">
              <input
                type="number" placeholder="Desde (ej. 2018)" value={anioDesde}
                onChange={(e) => setAnioDesde(e.target.value)}
                className="filter-input" min="1900" max="2100"
              />
              <span className="text-gray-400">â€”</span>
              <input
                type="number" placeholder="Hasta (ej. 2026)" value={anioHasta}
                onChange={(e) => setAnioHasta(e.target.value)}
                className="filter-input" min="1900" max="2100"
              />
            </div>
          </div>

          {/* MÃ­nimo de citas */}
          <div className="filter-section">
            <label className="filter-label">MÃ­nimo de citas</label>
            <input
              type="number" placeholder="ej. 10" value={minCitas}
              onChange={(e) => setMinCitas(e.target.value)}
              className="filter-input" min="0"
            />
          </div>

          {/* Autor */}
          <div className="filter-section">
            <label className="filter-label">Autor</label>
            <input
              type="text" placeholder="Nombre del autor..." value={autorFiltro}
              onChange={(e) => setAutorFiltro(e.target.value)}
              className="filter-input"
            />
          </div>

          {/* Orden */}
          <div className="filter-section">
            <label className="filter-label">Ordenar por</label>
            <div className="filter-areas">
              {(['relevancia', 'anio', 'citas'] as Orden[]).map((o) => (
                <button key={o} onClick={() => setOrden(o)} className={`filter-btn ${orden === o ? 'active' : ''}`}>
                  {o.charAt(0).toUpperCase() + o.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Resultados */}
      {!query && (
        <div className="empty-state">
          <Search size={48} className="text-gray-300" />
          <p className="text-gray-400">Introduce un tÃ©rmino para empezar a buscar</p>
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <Loader2 size={32} className="animate-spin text-indigo-500" />
          <p className="text-gray-400">Buscando artÃ­culos...</p>
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
          <div className="articulos-grid">
            {articulos.map((art) => (
              <ArticuloCard key={`${art.fuente}-${art.id}`} articulo={art} />
            ))}
          </div>
          {/* PaginaciÃ³n */}
          <div className="pagination">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="btn-outline-sm"
            >
              â† Anterior
            </button>
            <span className="pagination-info">PÃ¡gina {pagina}</span>
            <button
              onClick={() => setPagina((p) => p + 1)}
              disabled={articulos.length < 10}
              className="btn-outline-sm"
            >
              Siguiente â†’
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
