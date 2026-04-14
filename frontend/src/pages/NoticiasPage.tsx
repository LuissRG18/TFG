import { useState, useEffect } from 'react';
import { Newspaper, Globe, Search, RefreshCw } from 'lucide-react';
import { getNoticias } from '../services/noticiasService';
import NoticiaCard from '../components/NoticiaCard';
import type { Noticia } from '../types';

type Idioma = 'es' | 'en';

const FUENTES_ES = ['Todos', 'SINC', 'El País Ciencia', 'BBC Mundo'];
const FUENTES_EN = ['All', 'Phys.org', 'Nature'];

const NoticiasPage = () => {
  const [idioma, setIdioma]       = useState<Idioma>('es');
  const [noticias, setNoticias]   = useState<Noticia[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [busqueda, setBusqueda]   = useState('');
  const [fuente, setFuente]       = useState('Todos');

  const cargar = async (id: Idioma) => {
    setLoading(true);
    setError('');
    try {
      const res = await getNoticias(id, 50);
      setNoticias(res.noticias);
      setFuente(id === 'es' ? 'Todos' : 'All');
    } catch {
      setError('No se pudieron cargar las noticias. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(idioma); }, [idioma]);

  const fuentesList = idioma === 'es' ? FUENTES_ES : FUENTES_EN;
  const fuenteTodos = idioma === 'es' ? 'Todos' : 'All';

  const filtradas = noticias.filter((n) => {
    const matchFuente = fuente === fuenteTodos || n.fuente === fuente;
    const q = busqueda.toLowerCase();
    const matchQ = !q || n.titulo.toLowerCase().includes(q) || n.resumen.toLowerCase().includes(q);
    return matchFuente && matchQ;
  });

  return (
    <div className="noticias-page">
      {/* ── Header ─────────────────────────────── */}
      <div className="noticias-header">
        <div className="noticias-header-inner">
          <div className="noticias-header-text">
            <p className="section-eyebrow">Actualidad científica</p>
            <h1 className="noticias-title">
              <Newspaper size={32} /> Noticias de Ciencia
            </h1>
            <p className="noticias-subtitle">
              Últimas noticias de las principales fuentes científicas, actualizadas cada hora.
            </p>
          </div>

          {/* Tabs ES / EN */}
          <div className="noticias-tabs">
            <button
              className={`noticias-tab${idioma === 'es' ? ' noticias-tab--active' : ''}`}
              onClick={() => setIdioma('es')}
            >
              🇪🇸 Español
            </button>
            <button
              className={`noticias-tab${idioma === 'en' ? ' noticias-tab--active' : ''}`}
              onClick={() => setIdioma('en')}
            >
              🇬🇧 English
            </button>
          </div>
        </div>
      </div>

      {/* ── Filtros ────────────────────────────── */}
      <div className="noticias-filters">
        {/* Buscador */}
        <div className="noticias-search-wrap">
          <Search size={15} className="noticias-search-icon" />
          <input
            type="text"
            className="noticias-search"
            placeholder={idioma === 'es' ? 'Buscar noticias…' : 'Search news…'}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Filtro fuente */}
        <div className="noticias-fuente-tabs">
          {fuentesList.map((f) => (
            <button
              key={f}
              className={`noticias-fuente-btn${fuente === f ? ' active' : ''}`}
              onClick={() => setFuente(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Refrescar */}
        <button
          className="btn-outline-sm noticias-refresh"
          onClick={() => cargar(idioma)}
          title="Actualizar noticias"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* ── Contenido ──────────────────────────── */}
      <div className="noticias-content">
        {loading && (
          <div className="noticias-loading">
            <div className="noticias-spinner" />
            <p>Cargando noticias…</p>
          </div>
        )}

        {error && !loading && (
          <div className="noticias-error">
            <Globe size={40} />
            <p>{error}</p>
            <button className="btn-outline-sm" onClick={() => cargar(idioma)}>Reintentar</button>
          </div>
        )}

        {!loading && !error && filtradas.length === 0 && (
          <div className="noticias-empty">
            <Newspaper size={40} />
            <p>{idioma === 'es' ? 'No se encontraron noticias con ese filtro.' : 'No news found for this filter.'}</p>
          </div>
        )}

        {!loading && !error && filtradas.length > 0 && (
          <div className="noticias-grid">
            {filtradas.map((n) => (
              <NoticiaCard key={n._id || n.url} noticia={n} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticiasPage;
