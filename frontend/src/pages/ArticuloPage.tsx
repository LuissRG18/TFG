import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ExternalLink, FileText, Bookmark, BookmarkCheck,
  ArrowLeft, Loader2, AlertCircle, Sparkles, Users, Calendar, BookOpen, Quote
} from 'lucide-react';
import type { Articulo } from '../types';
import { obtenerArxivPorId, buscarCrossRef, obtenerOpenAlexPorId } from '../services/articulosService';
import PageHead from '../components/PageHead';

const FUENTE_LABEL: Record<string, string> = {
  arxiv: 'arXiv',
  crossref: 'CrossRef',
  openalex: 'OpenAlex',
};
import { agregarFavorito, eliminarFavorito, checkFavorito } from '../services/favoritosService';
import { useAuth } from '../context/AuthContext';

const ArticuloPage = () => {
  const { fuente, id } = useParams<{ fuente: string; id: string }>();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [articulo, setArticulo] = useState<Articulo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [divulgativo, setDivulgativo] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [favId, setFavId] = useState<string | undefined>();
  const [loadingFav, setLoadingFav] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      if (!id || !fuente) return;
      setLoading(true);
      setError('');
      try {
        if (fuente === 'arxiv') {
          const res = await obtenerArxivPorId(decodeURIComponent(id));
          setArticulo(res.articulo || null);
        } else if (fuente === 'crossref') {
          const res = await buscarCrossRef({ q: decodeURIComponent(id), limite: 1 });
          setArticulo(res.articulos[0] || null);
        } else if (fuente === 'openalex') {
          const res = await obtenerOpenAlexPorId(decodeURIComponent(id));
          setArticulo(res.articulo || null);
        }
      } catch {
        setError('No se pudo cargar el artículo.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id, fuente]);

  useEffect(() => {
    const check = async () => {
      if (!usuario || !id) return;
      try {
        const res = await checkFavorito(decodeURIComponent(id));
        setGuardado(res.esFavorito);
        setFavId(res.favorito?._id);
      } catch { /* sin token o error */ }
    };
    check();
  }, [usuario, id]);

  const handleFavorito = async () => {
    if (!usuario || !articulo) return;
    setLoadingFav(true);
    try {
      if (guardado && favId) {
        await eliminarFavorito(favId);
        setGuardado(false);
        setFavId(undefined);
      } else {
        const res = await agregarFavorito({ ...articulo });
        setGuardado(true);
        setFavId(res.favorito?._id);
      }
    } catch (e) { console.error(e); }
    finally { setLoadingFav(false); }
  };

  if (loading) return (
    <div className="loading-state">
      <Loader2 size={40} className="animate-spin text-indigo-500" />
      <p className="text-gray-400">Cargando artículo...</p>
    </div>
  );

  if (error || !articulo) return (
    <div className="page-container">
      <div className="error-banner"><AlertCircle size={18} /> {error || 'Artículo no encontrado.'}</div>
      <button onClick={() => navigate(-1)} className="btn-outline mt-4 inline-flex"><ArrowLeft size={14} /> Volver</button>
    </div>
  );

  const abstractTexto = divulgativo && articulo.abstractDivulgativo
    ? articulo.abstractDivulgativo
    : articulo.abstract;

  return (
    <div className="page-container articulo-page">
      <PageHead
        titulo={articulo.titulo}
        descripcion={(articulo.abstract || `Artículo de ${FUENTE_LABEL[articulo.fuente] ?? articulo.fuente}`).slice(0, 155)}
      />
      <button onClick={() => navigate(-1)} className="btn-link mb-4 inline-flex">
        <ArrowLeft size={14} /> Volver
      </button>

      <div className="articulo-detail-card">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`badge badge-${fuente}`}>{FUENTE_LABEL[fuente ?? ''] ?? fuente}</span>
          {articulo.anio && <span className="badge badge-year"><Calendar size={12} /> {articulo.anio}</span>}
          {articulo.revista && <span className="badge badge-default"><BookOpen size={12} /> {articulo.revista}</span>}
        </div>

        {/* Título */}
        <h1 className="articulo-detail-title">{articulo.titulo}</h1>

        {/* Autores */}
        {articulo.autores.length > 0 && (
          <p className="articulo-detail-autores">
            <Users size={15} className="inline mr-1 text-gray-400" />
            {articulo.autores.join(', ')}
          </p>
        )}

        {/* Stats */}
        <div className="articulo-stats">
          {articulo.citaciones !== undefined && (
            <div className="stat-item">
              <Quote size={16} className="text-indigo-400" />
              <span><strong>{articulo.citaciones}</strong> citas</span>
            </div>
          )}
          {articulo.referencias !== undefined && (
            <div className="stat-item">
              <BookOpen size={16} className="text-emerald-400" />
              <span><strong>{articulo.referencias}</strong> referencias</span>
            </div>
          )}
        </div>

        {/* Palabras clave */}
        {articulo.palabrasClave.length > 0 && (
          <div className="articulo-tags mb-4">
            {articulo.palabrasClave.map((kw, i) => (
              <span key={`${kw}-${i}`} className="tag">{kw}</span>
            ))}
          </div>
        )}

        {/* Abstract */}
        {abstractTexto && (
          <div className="abstract-section">
            <div className="abstract-header">
              <h2 className="abstract-title">Resumen</h2>
              {articulo.abstractDivulgativo && (
                <button onClick={() => setDivulgativo(!divulgativo)} className="btn-divulgativo">
                  <Sparkles size={13} />
                  {divulgativo ? 'Abstract original' : 'Modo divulgativo'}
                </button>
              )}
            </div>
            <p className="abstract-text">{abstractTexto}</p>
          </div>
        )}

        {/* Acciones */}
        <div className="articulo-acciones mt-6">
          <a href={articulo.urlOriginal} target="_blank" rel="noreferrer" className="btn-primary">
            <ExternalLink size={15} /> Ver artículo original
          </a>
          {articulo.urlPdf && (
            <a href={articulo.urlPdf} target="_blank" rel="noreferrer" className="btn-outline">
              <FileText size={15} /> Descargar PDF
            </a>
          )}
          {usuario && (
            <button
              onClick={handleFavorito}
              disabled={loadingFav}
              className={`btn-favorito-lg ${guardado ? 'guardado' : ''}`}
            >
              {guardado ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              {guardado ? 'En favoritos' : 'Guardar en favoritos'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticuloPage;

