import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, FileText, Bookmark, BookmarkCheck, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import type { Articulo } from '../types';
import { useAuth } from '../context/AuthContext';
import { agregarFavorito, eliminarFavorito } from '../services/favoritosService';

interface Props {
  articulo: Articulo;
  favoritoId?: string; // si ya está guardado en BD
  onFavoritoChange?: () => void;
}

const BADGE_COLORS: Record<string, string> = {
  arxiv: 'badge-arxiv',
  semanticscholar: 'badge-semantic',
  crossref: 'badge-crossref',
};

const FUENTE_LABEL: Record<string, string> = {
  arxiv: 'arXiv',
  semanticscholar: 'Semantic Scholar',
  crossref: 'CrossRef',
};

const ArticuloCard = ({ articulo, favoritoId, onFavoritoChange }: Props) => {
  const { usuario } = useAuth();
  const [expandido, setExpandido] = useState(false);
  const [mostraDivulgativo, setMostraDivulgativo] = useState(false);
  const [guardado, setGuardado] = useState(!!favoritoId);
  const [favId, setFavId] = useState(favoritoId);
  const [loadingFav, setLoadingFav] = useState(false);

  const handleFavorito = async () => {
    if (!usuario) return;
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
      onFavoritoChange?.();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFav(false);
    }
  };

  const abstractTexto = mostraDivulgativo && articulo.abstractDivulgativo
    ? articulo.abstractDivulgativo
    : articulo.abstract;

  return (
    <article className="articulo-card">
      {/* Visual cover band */}
      <div className={`articulo-card-cover cover-${articulo.fuente}`}>
        <div className="articulo-card-header">
          <span className={`badge ${BADGE_COLORS[articulo.fuente] || 'badge-default'}`}>
            {FUENTE_LABEL[articulo.fuente] || articulo.fuente}
          </span>
          {articulo.anio && <span className="cover-meta">{articulo.anio}</span>}
          {articulo.citaciones !== undefined && articulo.citaciones > 0 && (
            <span className="cover-meta">📚 {articulo.citaciones} citas</span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="articulo-card-body">
        {/* Título */}
        <Link
          to={`/articulo/${articulo.fuente}/${encodeURIComponent(articulo.id)}`}
          className="articulo-titulo"
        >
          {articulo.titulo}
        </Link>

        {/* Autores */}
        {articulo.autores.length > 0 && (
          <p className="articulo-autores">
            {articulo.autores.slice(0, 4).join(', ')}
            {articulo.autores.length > 4 && ` +${articulo.autores.length - 4} más`}
          </p>
        )}

        {/* Revista */}
        {articulo.revista && (
          <p className="articulo-revista">{articulo.revista}</p>
        )}

        {/* Abstract */}
        {abstractTexto && (
          <div className="articulo-abstract-wrapper">
            {articulo.abstractDivulgativo && (
              <button
                onClick={() => setMostraDivulgativo(!mostraDivulgativo)}
                className="btn-divulgativo"
                title="Modo divulgativo"
              >
                <Sparkles size={13} />
                {mostraDivulgativo ? 'Abstract original' : 'Modo divulgativo'}
              </button>
            )}
            <p className={`articulo-abstract ${!expandido && 'abstract-truncado'}`}>
              {abstractTexto}
            </p>
            {abstractTexto.length > 300 && (
              <button onClick={() => setExpandido(!expandido)} className="btn-ver-mas">
                {expandido ? <><ChevronUp size={14} /> Ver menos</> : <><ChevronDown size={14} /> Ver más</>}
              </button>
            )}
          </div>
        )}

        {/* Palabras clave */}
        {articulo.palabrasClave.length > 0 && (
          <div className="articulo-tags">
            {articulo.palabrasClave.slice(0, 5).map((kw) => (
              <span key={kw} className="tag">{kw}</span>
            ))}
          </div>
        )}

        {/* Acciones */}
        <div className="articulo-acciones">
          <a
            href={articulo.urlOriginal}
            target="_blank"
            rel="noreferrer"
            className="btn-link"
          >
            <ExternalLink size={14} /> Ver artículo
          </a>
          {articulo.urlPdf && (
            <a
              href={articulo.urlPdf}
              target="_blank"
              rel="noreferrer"
              className="btn-link"
            >
              <FileText size={14} /> PDF
            </a>
          )}
          {usuario && (
            <button
              onClick={handleFavorito}
              disabled={loadingFav}
              className={`btn-favorito ${guardado ? 'guardado' : ''}`}
              title={guardado ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            >
              {guardado ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              {guardado ? 'Guardado' : 'Guardar'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ArticuloCard;

