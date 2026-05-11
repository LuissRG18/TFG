import { useState } from 'react';
import type { Noticia } from '../types';
import { ExternalLink } from 'lucide-react';

interface Props {
  noticia: Noticia;
  compact?: boolean;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch {
    return '';
  }
}

const SOURCE_STYLES: Record<string, { bg: string }> = {
  'SINC':             { bg: 'linear-gradient(135deg, #154360 0%, #1a5276 100%)' },
  'El País Ciencia':  { bg: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' },
  'BBC Mundo':        { bg: 'linear-gradient(135deg, #9b0000 0%, #cc0000 100%)' },
  'Muy Interesante':  { bg: 'linear-gradient(135deg, #b84000 0%, #e67e22 100%)' },
  'Phys.org':         { bg: 'linear-gradient(135deg, #1a3c34 0%, #1e7e5a 100%)' },
  'Nature':           { bg: 'linear-gradient(135deg, #1b2a5e 0%, #2741a3 100%)' },
};
const DEFAULT_SOURCE_STYLE = { bg: 'linear-gradient(135deg, #1c3353 0%, #2c4a6e 100%)' };

const NoticiaCard = ({ noticia, compact = false }: Props) => {
  const [imgError, setImgError] = useState(false);
  const sourceStyle = SOURCE_STYLES[noticia.fuente] ?? DEFAULT_SOURCE_STYLE;
  const showFallback = !noticia.imagen || imgError;

  return (
    <a
      href={noticia.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`noticia-card${compact ? ' noticia-card--compact' : ''}`}
    >
      {showFallback ? (
        <div className="noticia-card-img-fallback" style={{ background: sourceStyle.bg }}>
          <span className="noticia-card-img-fallback-name">{noticia.fuente}</span>
        </div>
      ) : (
        <div className="noticia-card-img-wrap">
          <img
            src={noticia.imagen}
            alt={noticia.titulo}
            className="noticia-card-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
          <div className="noticia-card-img-overlay" />
        </div>
      )}
      <div className="noticia-card-body">
        <div className="noticia-card-meta">
          <span className="noticia-card-fuente">{noticia.fuente}</span>
          <span className="noticia-card-fecha">{formatDate(noticia.fecha)}</span>
        </div>
        <h3 className="noticia-card-titulo">{noticia.titulo}</h3>
        {!compact && noticia.resumen && (
          <p className="noticia-card-resumen">{noticia.resumen}</p>
        )}
        <span className="noticia-card-link">
          Leer artículo <ExternalLink size={12} />
        </span>
      </div>
    </a>
  );
};

export default NoticiaCard;
