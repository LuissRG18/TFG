import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Trash2, RefreshCw } from 'lucide-react';
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
      const res = await obtenerHistorial({ pagina: p, limite: 50 });
      // Deduplicate by termino+fuente, keep most recent
      const seen = new Map<string, BusquedaHistorial & { count: number }>();
      for (const b of res.busquedas) {
        const key = `${b.termino.toLowerCase()}__${b.fuente}`;
        if (!seen.has(key)) {
          seen.set(key, { ...b, count: 1 });
        } else {
          seen.get(key)!.count++;
          // keep the one with more results, or latest date
          const existing = seen.get(key)!;
          if (b.resultados > existing.resultados) seen.set(key, { ...b, count: existing.count + 1 });
          else existing.count++;
        }
      }
      setBusquedas(Array.from(seen.values()) as BusquedaHistorial[]);
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
    <div className="historial-page">
      <div className="historial-page-header">
        <div className="historial-page-header-inner">
          <p className="section-eyebrow">TU ACTIVIDAD RECIENTE</p>
          <h1 className="historial-page-title">Historial de búsquedas</h1>
          <p className="historial-page-sub">Consulta y repite tus búsquedas anteriores</p>
        </div>
      </div>

      <div className="historial-page-content">
        {loading && (
          <div className="loading-state">
            <Loader2 size={32} className="animate-spin" />
          </div>
        )}

        {error && <div className="error-banner">{error}</div>}

        {!loading && busquedas.length === 0 && (
          <div className="empty-state">
            <p>Aún no has realizado ninguna búsqueda.</p>
          </div>
        )}

        {!loading && busquedas.length > 0 && (
          <>
            <div className="historial-table-wrapper">
              <table className="historial-table">
                <thead>
                  <tr>
                    <th>TÉRMINO</th>
                    <th>FUENTE</th>
                    <th>RESULTADOS</th>
                    <th>FECHA</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {busquedas.map((b) => (
                    <tr key={b._id}>
                      <td className="historial-termino">"{b.termino}"</td>
                      <td><span className="historial-badge">{FUENTE_LABELS[b.fuente] || b.fuente}</span></td>
                      <td className="historial-num">{b.resultados.toLocaleString()}</td>
                      <td className="historial-date">{new Date(b.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="historial-actions">
                        <button onClick={() => handleRepetir(b)} className="historial-action-btn" title="Repetir">
                          <RefreshCw size={14} /> Repetir
                        </button>
                        <button onClick={() => handleEliminar(b._id)} disabled={eliminando === b._id} className="historial-action-btn danger" title="Eliminar">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPaginas > 1 && (
              <div className="pagination">
                <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1} className="btn-outline-sm">← Anterior</button>
                <span className="pagination-info">Página {pagina} / {totalPaginas}</span>
                <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina >= totalPaginas} className="btn-outline-sm">Siguiente →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HistorialPage;

