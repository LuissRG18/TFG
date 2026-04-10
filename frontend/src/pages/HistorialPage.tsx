import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Loader2, Trash2, Search, RefreshCw } from 'lucide-react';
import type { BusquedaHistorial } from '../types';
import { obtenerHistorial, eliminarBusqueda } from '../services/favoritosService';

const FUENTE_LABELS: Record<string, string> = {
  arxiv: 'arXiv',
  crossref: 'CrossRef',
  todas: 'Todas',
};

const HistorialPage = () => {
  const navigate = useNavigate();
  const [busquedas, setBusquedas] = useState<BusquedaHistorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [eliminando, setEliminando] = useState<string | null>(null);

  const cargar = async (p = pagina) => {
    setLoading(true);
    setError('');
    try {
      const res = await obtenerHistorial({ pagina: p, limite: 20 });
      setBusquedas(res.busquedas);
      setTotalPaginas(res.totalPaginas || 1);
    } catch {
      setError('No se pudo cargar el historial.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(pagina); }, [pagina]);

  const handleRepetir = (b: BusquedaHistorial) => {
    const params = new URLSearchParams({ q: b.termino });
    if (b.area) params.set('area', b.area);
    navigate(`/buscar?${params.toString()}`);
  };

  const handleEliminar = async (id: string) => {
    setEliminando(id);
    try {
      await eliminarBusqueda(id);
      setBusquedas((prev) => prev.filter((b) => b._id !== id));
    } catch {
      setError('No se pudo eliminar la búsqueda.');
    } finally {
      setEliminando(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <History size={28} className="text-indigo-500" />
          <h1 className="page-title">Historial de Búsquedas</h1>
        </div>
        <p className="page-subtitle">Tus últimas búsquedas realizadas</p>
      </div>

      {loading && (
        <div className="loading-state">
          <Loader2 size={32} className="animate-spin text-indigo-500" />
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      {!loading && busquedas.length === 0 && (
        <div className="empty-state">
          <History size={48} className="text-gray-300" />
          <p className="text-gray-400">Aún no has realizado ninguna búsqueda.</p>
        </div>
      )}

      {!loading && busquedas.length > 0 && (
        <>
          <div className="historial-list">
            {busquedas.map((b) => (
              <div key={b._id} className="historial-item">
                <div className="historial-item-info">
                  <Search size={16} className="text-indigo-400 flex-shrink-0" />
                  <div>
                    <span className="historial-termino">"{b.termino}"</span>
                    <div className="historial-meta">
                      <span className="badge badge-default">{FUENTE_LABELS[b.fuente] || b.fuente}</span>
                      {b.area && <span className="tag">{b.area}</span>}
                      <span className="text-gray-400 text-xs">
                        {b.resultados} resultados · {new Date(b.createdAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => handleRepetir(b)}
                    className="btn-outline-sm"
                    title="Repetir búsqueda"
                  >
                    <RefreshCw size={13} /> Repetir
                  </button>
                  <button
                    onClick={() => handleEliminar(b._id)}
                    disabled={eliminando === b._id}
                    className="btn-danger-sm"
                    title="Eliminar del historial"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="btn-outline-sm"
              >
                ← Anterior
              </button>
              <span className="pagination-info">Página {pagina} / {totalPaginas}</span>
              <button
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={pagina >= totalPaginas}
                className="btn-outline-sm"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistorialPage;
