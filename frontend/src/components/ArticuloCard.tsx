import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink, FileText, Bookmark, BookmarkCheck,
  ChevronDown, ChevronUp, Sparkles, Download, Share2, Copy, CheckCheck,
} from 'lucide-react';
import type { Articulo } from '../types';
import { useAuth } from '../context/AuthContext';
import { agregarFavorito, eliminarFavorito } from '../services/favoritosService';
import { formatAPA, formatMLA, formatBibtex, formatRIS, downloadText } from '../utils/exportCitation';

interface Props {
  articulo: Articulo;
  favoritoId?: string;
  onFavoritoChange?: () => void;
  /** If provided, card shows a checkbox for comparison selection */
  onSelectCompare?: (art: Articulo, selected: boolean) => void;
  isSelectedForCompare?: boolean;
}

const BADGE_COLORS: Record<string, string> = {
  arxiv: 'badge-arxiv',
  crossref: 'badge-crossref',
  semanticscholar: 'badge-semanticscholar',
};

const FUENTE_LABEL: Record<string, string> = {
  arxiv: 'arXiv',
  crossref: 'CrossRef',
  semanticscholar: 'Semantic Scholar',
};

const ArticuloCard = ({ articulo, favoritoId, onFavoritoChange, onSelectCompare, isSelectedForCompare }: Props) => {
  const { usuario } = useAuth();
  const [expandido, setExpandido] = useState(false);
  const [mostraDivulgativo, setMostraDivulgativo] = useState(false);
  const [guardado, setGuardado] = useState(!!favoritoId);
  const [favId, setFavId] = useState(favoritoId);
  const [loadingFav, setLoadingFav] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopyAPA = () => {
    navigator.clipboard.writeText(formatAPA(articulo));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const url = articulo.urlOriginal;
    if (navigator.share) {
      await navigator.share({ title: articulo.titulo, url });
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = (formato: 'bibtex' | 'ris' | 'apa' | 'mla') => {
    const safeTitle = articulo.titulo.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
    if (formato === 'bibtex') {
      downloadText(formatBibtex(articulo), `${safeTitle}.bib`, 'application/x-bibtex');
    } else if (formato === 'ris') {
      downloadText(formatRIS(articulo), `${safeTitle}.ris`, 'application/x-research-info-systems');
    } else if (formato === 'apa') {
      downloadText(formatAPA(articulo), `${safeTitle}_APA.txt`, 'text/plain');
    } else {
      downloadText(formatMLA(articulo), `${safeTitle}_MLA.txt`, 'text/plain');
    }
    setShowExport(false);
  };

  const abstractTexto = mostraDivulgativo && articulo.abstractDivulgativo
    ? articulo.abstractDivulgativo
    : articulo.abstract;

  return (
    <article className={`articulo-card ${isSelectedForCompare ? 'articulo-card--selected' : ''}`}>
      {/* Visual cover band */}
      <div className={`articulo-card-cover cover-${articulo.fuente}`}>
        <div className="articulo-card-header">
          {onSelectCompare && (
            <input
              type="checkbox"
              checked={!!isSelectedForCompare}
              onChange={(e) => onSelectCompare(articulo, e.target.checked)}
              className="mr-2"
              title="Seleccionar para comparar"
            />
          )}
          <span className={`badge ${BADGE_COLORS[articulo.fuente] || 'badge-default'}`}>
            {FUENTE_LABEL[articulo.fuente] || articulo.fuente}
          </span>
          {articulo.anio && <span className="cover-meta">{articulo.anio}</span>}
          {articulo.citaciones !== undefined && articulo.citaciones > 0 && (
            <span className="cover-meta">ðŸ“š {articulo.citaciones} citas</span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="articulo-card-body">
        <Link
          to={`/articulo/${articulo.fuente}/${encodeURIComponent(articulo.id)}`}
          className="articulo-titulo"
        >
          {articulo.titulo}
        </Link>

        {articulo.autores.length > 0 && (
          <p className="articulo-autores">
            {articulo.autores.slice(0, 4).join(', ')}
            {articulo.autores.length > 4 && ` +${articulo.autores.length - 4} mÃ¡s`}
          </p>
        )}

        {articulo.revista && (
          <p className="articulo-revista">{articulo.revista}</p>
        )}

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
                {expandido ? <><ChevronUp size={14} /> Ver menos</> : <><ChevronDown size={14} /> Ver mÃ¡s</>}
              </button>
            )}
          </div>
        )}

        {articulo.palabrasClave.length > 0 && (
          <div className="articulo-tags">
            {articulo.palabrasClave.slice(0, 5).map((kw, i) => (
              <span key={`${kw}-${i}`} className="tag">{kw}</span>
            ))}
          </div>
        )}

        {/* Acciones */}
        <div className="articulo-acciones">
          <a href={articulo.urlOriginal} target="_blank" rel="noreferrer" className="btn-link">
            <ExternalLink size={14} /> Ver artÃ­culo
          </a>
          {articulo.urlPdf && (
            <a href={articulo.urlPdf} target="_blank" rel="noreferrer" className="btn-link">
              <FileText size={14} /> PDF
            </a>
          )}

          {/* Citar APA */}
          <button onClick={handleCopyAPA} className="btn-link" title="Copiar cita APA">
            {copied ? <CheckCheck size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? 'Copiado' : 'Citar APA'}
          </button>

          {/* Compartir */}
          <button onClick={handleShare} className="btn-link" title="Compartir">
            <Share2 size={14} /> Compartir
          </button>

          {/* Exportar referencias */}
          <div className="export-dropdown-wrapper">
            <button onClick={() => setShowExport(!showExport)} className="btn-link" title="Exportar referencia">
              <Download size={14} /> Exportar
            </button>
            {showExport && (
              <div className="export-dropdown">
                <button onClick={() => handleExport('bibtex')} className="export-option">BibTeX (.bib)</button>
                <button onClick={() => handleExport('ris')} className="export-option">RIS (.ris)</button>
                <button onClick={() => handleExport('apa')} className="export-option">APA (.txt)</button>
                <button onClick={() => handleExport('mla')} className="export-option">MLA (.txt)</button>
              </div>
            )}
          </div>

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
