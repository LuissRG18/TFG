import { useEffect, useState } from 'react';
import { BookMarked, Loader2, Trash2, StickyNote, Tag, Clock, FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Favorito } from '../types';
import { obtenerFavoritos, eliminarFavorito, actualizarFavorito, obtenerColecciones } from '../services/favoritosService';
import ArticuloCard from '../components/ArticuloCard';

const LIMITE = 10;

const FavoritosPage = () => {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [colecciones, setColecciones] = useState<{ _id: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroLeer, setFiltroLeer] = useState<boolean | undefined>(undefined);
  const [filtroColeccion, setFiltroColeccion] = useState<string>('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);

  const cargar = async (p = pagina) => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { pagina: p, limite: LIMITE };
      if (filtroLeer !== undefined) params.leidoMasTarde = filtroLeer;
      if (filtroColeccion) params.coleccion = filtroColeccion;
      const res = await obtenerFavoritos(params as any);
      setFavoritos(res.favoritos);
      setTotal(res.total);
      setTotalPaginas(res.totalPaginas || 1);
    } catch {
      setError('No se pudieron cargar los favoritos.');
    } finally {
      setLoading(false);
    }
  };

  const cargarColecciones = async () => {
    try {
      const res = await obtenerColecciones();
      setColecciones(res.colecciones);
    } catch { /* silent */ }
  };

  useEffect(() => {
    setPagina(1);
  }, [filtroLeer, filtroColeccion]);

  useEffect(() => { cargar(pagina); }, [pagina, filtroLeer, filtroColeccion]);
  useEffect(() => { cargarColecciones(); }, []);

  const handleEliminar = async (id: string) => {
    await eliminarFavorito(id);
    setFavoritos((prev) => prev.filter((f) => f._id !== id));
    setTotal((t) => t - 1);
  };

  const toggleLeerMasTarde = async (fav: Favorito) => {
    await actualizarFavorito(fav._id, { leidoMasTarde: !fav.leidoMasTarde });
    setFavoritos((prev) =>
      prev.map((f) => f._id === fav._id ? { ...f, leidoMasTarde: !f.leidoMasTarde } : f)
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <BookMarked size={28} className="text-indigo-500" />
          <h1 className="page-title">Mis Favoritos</h1>
        </div>
        <p className="page-subtitle">{total} artÃ­culo(s) guardado(s)</p>
      </div>

      {/* Filtros */}
      <div className="buscar-filters-bar mb-4 flex-wrap">
        <button onClick={() => { setFiltroLeer(undefined); setFiltroColeccion(''); }} className={`filter-btn ${filtroLeer === undefined && !filtroColeccion ? 'active' : ''}`}>
          Todos
        </button>
        <button onClick={() => setFiltroLeer(true)} className={`filter-btn ${filtroLeer === true ? 'active' : ''}`}>
          <Clock size={13} /> Leer mÃ¡s tarde
        </button>
        {colecciones.map((c) => (
          <button key={c._id} onClick={() => { setFiltroColeccion(c._id); setFiltroLeer(undefined); }} className={`filter-btn ${filtroColeccion === c._id ? 'active' : ''}`}>
            <FolderOpen size={13} /> {c._id} ({c.total})
          </button>
        ))}
      </div>

      {loading && (
        <div className="loading-state">
          <Loader2 size={32} className="animate-spin text-indigo-500" />
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      {!loading && favoritos.length === 0 && (
        <div className="empty-state">
          <BookMarked size={48} className="text-gray-300" />
          <p className="text-gray-400">AÃºn no tienes favoritos guardados.</p>
        </div>
      )}

      <div className="articulos-list">
        {favoritos.map((fav) => (
          <div key={fav._id} className="favorito-wrapper">
            <ArticuloCard
              articulo={{ ...fav, id: fav.articuloId }}
              favoritoId={fav._id}
              onFavoritoChange={() => cargar(pagina)}
            />
            <div className="favorito-actions">
              <button
                onClick={() => toggleLeerMasTarde(fav)}
                className={`btn-link ${fav.leidoMasTarde ? 'text-amber-500' : ''}`}
                title="Leer mÃ¡s tarde"
              >
                <Clock size={14} /> {fav.leidoMasTarde ? 'Quitar de "leer despuÃ©s"' : 'Leer mÃ¡s tarde'}
              </button>
              {fav.coleccion && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <FolderOpen size={12} /> {fav.coleccion}
                </span>
              )}
              {fav.etiquetas && fav.etiquetas.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  <Tag size={13} className="text-gray-400" />
                  {fav.etiquetas.map((et) => <span key={et} className="tag">{et}</span>)}
                </div>
              )}
              {fav.notas && (
                <p className="favorito-notas"><StickyNote size={13} className="inline mr-1" />{fav.notas}</p>
              )}
              <button onClick={() => handleEliminar(fav._id)} className="btn-danger-sm">
                <Trash2 size={13} /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PaginaciÃ³n */}
      {totalPaginas > 1 && (
        <div className="pagination">
          <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1} className="btn-outline-sm">
            <ChevronLeft size={14} /> Anterior
          </button>
          <span className="pagination-info">PÃ¡gina {pagina} / {totalPaginas}</span>
          <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina >= totalPaginas} className="btn-outline-sm">
            Siguiente <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoritosPage;
