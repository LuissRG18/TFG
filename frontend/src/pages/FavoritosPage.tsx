import { useEffect, useState } from 'react';
import { BookMarked, Loader2, Trash2, StickyNote, Tag, Clock } from 'lucide-react';
import type { Favorito } from '../types';
import { obtenerFavoritos, eliminarFavorito, actualizarFavorito } from '../services/favoritosService';
import ArticuloCard from '../components/ArticuloCard';

const FavoritosPage = () => {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroLeer, setFiltroLeer] = useState<boolean | undefined>(undefined);

  const cargar = async () => {
    setLoading(true);
    try {
      const params = filtroLeer !== undefined ? { leidoMasTarde: filtroLeer } : {};
      const res = await obtenerFavoritos(params);
      setFavoritos(res.favoritos);
    } catch {
      setError('No se pudieron cargar los favoritos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [filtroLeer]);

  const handleEliminar = async (id: string) => {
    await eliminarFavorito(id);
    setFavoritos((prev) => prev.filter((f) => f._id !== id));
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
        <p className="page-subtitle">{favoritos.length} artículo(s) guardado(s)</p>
      </div>

      {/* Filtros */}
      <div className="buscar-filters-bar mb-4">
        <button
          onClick={() => setFiltroLeer(undefined)}
          className={`filter-btn ${filtroLeer === undefined ? 'active' : ''}`}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltroLeer(true)}
          className={`filter-btn ${filtroLeer === true ? 'active' : ''}`}
        >
          <Clock size={13} /> Leer más tarde
        </button>
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
          <p className="text-gray-400">Aún no tienes favoritos guardados.</p>
        </div>
      )}

      <div className="articulos-list">
        {favoritos.map((fav) => (
          <div key={fav._id} className="favorito-wrapper">
            <ArticuloCard
              articulo={{ ...fav, id: fav.articuloId }}
              favoritoId={fav._id}
              onFavoritoChange={cargar}
            />
            <div className="favorito-actions">
              <button
                onClick={() => toggleLeerMasTarde(fav)}
                className={`btn-link ${fav.leidoMasTarde ? 'text-amber-500' : ''}`}
                title="Leer más tarde"
              >
                <Clock size={14} /> {fav.leidoMasTarde ? 'Quitar de "leer después"' : 'Leer más tarde'}
              </button>
              {fav.etiquetas && fav.etiquetas.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  <Tag size={13} className="text-gray-400" />
                  {fav.etiquetas.map((et) => <span key={et} className="tag">{et}</span>)}
                </div>
              )}
              {fav.notas && (
                <p className="favorito-notas"><StickyNote size={13} className="inline mr-1" />{fav.notas}</p>
              )}
              <button
                onClick={() => handleEliminar(fav._id)}
                className="btn-danger-sm"
              >
                <Trash2 size={13} /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritosPage;

