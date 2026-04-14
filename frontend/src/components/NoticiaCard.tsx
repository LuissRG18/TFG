import type { Noticia } from '../types';
import { ExternalLink, Newspaper } from 'lucide-react';

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

const NoticiaCard = ({ noticia, compact = false }: Props) => {
  return (
    <a
      href={noticia.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`noticia-card${compact ? ' noticia-card--compact' : ''}`}
    >
      {noticia.imagen ? (
        <div className="noticia-card-img-wrap">
          <img
            src={noticia.imagen}
            alt={noticia.titulo}
            className="noticia-card-img"
            loading="lazy"
            onError={(e) => {
              const wrap = (e.currentTarget as HTMLImageElement).parentElement;
              if (wrap) {
                wrap.className = 'noticia-card-img-placeholder';
                wrap.innerHTML = '';
              }
            }}
          />
          <div className="noticia-card-img-overlay" />
        </div>
      ) : (
        <div className="noticia-card-img-placeholder">
          <Newspaper size={28} />
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
