import { useEffect, useState, useCallback } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import ArticuloCard from '../components/ArticuloCard';
import type { Articulo } from '../types';
import { AREAS_CIENTIFICAS } from '../types';
import { useAuth } from '../context/AuthContext';
import { buscarArxiv } from '../services/articulosService';

const RecomendacionesPage = () => {
  const { usuario } = useAuth();
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [areaActiva, setAreaActiva] = useState<string>('');

  const areasUsuario = usuario?.areasInteres ?? [];

  // Determine which area to fetch for
  const areaEfectiva = areaActiva || areasUsuario[0] || 'cs';

  const cargar = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Use the area id as query term to get fresh papers
      const areaInfo = AREAS_CIENTIFICAS.find((a) => a.id === areaEfectiva);
      const query = areaInfo ? areaInfo.label : areaEfectiva;
      const res = await buscarArxiv({ q: query, area: areaEfectiva, limite: 8 });
      setArticulos(res.articulos);
    } catch {
      setError('No se pudieron cargar las recomendaciones.');
    } finally {
      setLoading(false);
    }
  }, [areaEfectiva]);

  useEffect(() => { cargar(); }, [cargar]);

  const areasDisponibles = areasUsuario.length > 0
    ? AREAS_CIENTIFICAS.filter((a) => areasUsuario.includes(a.id))
    : AREAS_CIENTIFICAS.slice(0, 6);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <Sparkles size={28} className="text-amber-400" />
          <h1 className="page-title">Recomendaciones</h1>
        </div>
        <p className="page-subtitle">
          Artículos recientes basados en {areasUsuario.length > 0 ? 'tus áreas de interés' : 'áreas populares'}
        </p>
      </div>

      {/* Area selector */}
      <div className="buscar-filters-bar mb-4">
        {areasDisponibles.map((a) => (
          <button
            key={a.id}
            onClick={() => setAreaActiva(a.id)}
            className={`filter-btn ${areaEfectiva === a.id ? 'active' : ''}`}
          >
            {a.emoji} {a.label}
          </button>
        ))}
        <button onClick={cargar} className="btn-outline-sm ml-auto" title="Actualizar">
          <RefreshCw size={13} /> Actualizar
        </button>
      </div>

      {loading && (
        <div className="loading-state">
          <Loader2 size={32} className="animate-spin text-indigo-500" />
          <p className="text-gray-400">Cargando recomendaciones...</p>
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      {!loading && !error && articulos.length === 0 && (
        <div className="empty-state">
          <Sparkles size={48} className="text-gray-300" />
          <p className="text-gray-400">No se encontraron artículos para esta área.</p>
        </div>
      )}

      {!loading && articulos.length > 0 && (
        <div className="articulos-grid">
          {articulos.map((art) => (
            <ArticuloCard key={`${art.fuente}-${art.id}`} articulo={art} />
          ))}
        </div>
      )}

      {!usuario && (
        <div className="info-banner mt-6">
          💡 <strong>Tip:</strong> Configura tus áreas de interés en tu perfil para recibir recomendaciones personalizadas.
        </div>
      )}
    </div>
  );
};

export default RecomendacionesPage;
