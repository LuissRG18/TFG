import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, AlertCircle } from 'lucide-react';
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
  const [autorFiltro] = useState('');
  const [orden, setOrden] = useState<Orden>('relevancia');
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      if (anioDesde) arts = arts.filter((a) => (a.anio ?? 0) >= Number(anioDesde));
      if (anioHasta) arts = arts.filter((a) => (a.anio ?? 9999) <= Number(anioHasta));
      if (minCitas) arts = arts.filter((a) => (a.citaciones ?? 0) >= Number(minCitas));
      if (orden === 'anio') arts = [...arts].sort((a, b) => (b.anio ?? 0) - (a.anio ?? 0));
      if (orden === 'citas') arts = [...arts].sort((a, b) => (b.citaciones ?? 0) - (a.citaciones ?? 0));

      setArticulos(arts);
      setTotal(result.total);

      if (usuario) {
        guardarBusqueda({ termino: query, fuente, area: area || undefined, resultados: arts.length })
          .catch(() => {});
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
    <div className="buscar-page">
      {/* ── Header ── */}
      <div className="buscar-page-header">
        <div className="buscar-page-header-inner">
          {query ? (
            <>
              <p className="section-eyebrow">RESULTADOS DE BÚSQUEDA</p>
              <h1 className="buscar-page-title">Resultados para <em>"{query}"</em></h1>
              {!loading && total > 0 && (
                <p className="buscar-page-count">
                  {total.toLocaleString()} artículos encontrados · ordenado por {orden}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="section-eyebrow">BUSCAR ARTÍCULOS</p>
              <h1 className="buscar-page-title">Explorar la literatura científica</h1>
            </>
          )}
          <div className="buscar-header">
            <SearchBar defaultValue={query} />
          </div>
        </div>
      </div>

      <div className="buscar-layout">
        {/* ── Left panel: filters ── */}
        <aside className="buscar-sidebar">
          <div className="sidebar-filter-group">
            <h4 className="sidebar-filter-title">FUENTE</h4>
            {FUENTES.map((f) => (
              <label key={f.id} className="sidebar-radio">
                <input type="radio" name="fuente" checked={fuente === f.id} onChange={() => setFuente(f.id)} />
                <span>{f.label}</span>
              </label>
            ))}
          </div>

          <div className="sidebar-filter-group">
            <h4 className="sidebar-filter-title">ÁREA CIENTÍFICA</h4>
            <label className="sidebar-radio">
              <input type="radio" name="area" checked={!area} onChange={() => setArea('')} />
              <span>Todas</span>
            </label>
            {AREAS_CIENTIFICAS.map((a) => (
              <label key={a.id} className="sidebar-radio">
                <input type="radio" name="area" checked={area === a.id} onChange={() => setArea(a.id)} />
                <span>{a.label}</span>
              </label>
            ))}
          </div>

          <div className="sidebar-filter-group">
            <h4 className="sidebar-filter-title">AÑO</h4>
            <div className="sidebar-range">
              <input type="number" placeholder="Desde" value={anioDesde} onChange={(e) => setAnioDesde(e.target.value)} className="sidebar-range-input" min="1900" max="2100" />
              <span>—</span>
              <input type="number" placeholder="Hasta" value={anioHasta} onChange={(e) => setAnioHasta(e.target.value)} className="sidebar-range-input" min="1900" max="2100" />
            </div>
          </div>

          <div className="sidebar-filter-group">
            <h4 className="sidebar-filter-title">MÍNIMO DE CITAS</h4>
            <input type="number" placeholder="ej. 10" value={minCitas} onChange={(e) => setMinCitas(e.target.value)} className="sidebar-range-input full" min="0" />
          </div>

          <div className="sidebar-filter-group">
            <h4 className="sidebar-filter-title">ORDENAR POR</h4>
            {(['relevancia', 'anio', 'citas'] as Orden[]).map((o) => (
              <label key={o} className="sidebar-radio">
                <input type="radio" name="orden" checked={orden === o} onChange={() => setOrden(o)} />
                <span>{o.charAt(0).toUpperCase() + o.slice(1)}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* ── Right: results ── */}
        <main className="buscar-results">
          {!query && (
            <div className="empty-state">
              <Search size={48} className="text-gray-300" />
              <p className="text-gray-400">Introduce un término para empezar a buscar</p>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <Loader2 size={32} className="animate-spin text-indigo-500" />
              <p className="text-gray-400">Buscando artículos…</p>
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

          {!loading && !error && query && articulos.length === 0 && (
            <div className="empty-state">
              <Search size={48} className="text-gray-300" />
              <p className="text-gray-400">No se encontraron resultados para "{query}"</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BuscarPage;
