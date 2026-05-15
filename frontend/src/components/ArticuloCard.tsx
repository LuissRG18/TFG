import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ExternalLink, FileText, Bookmark, BookmarkCheck,
  ChevronDown, ChevronUp, Sparkles, Download, Share2, Copy, CheckCheck, MoreHorizontal,
} from 'lucide-react';
import type { Articulo } from '../types';
import { useAuth } from '../context/AuthContext';
import { agregarFavorito, eliminarFavorito } from '../services/favoritosService';
import { formatAPA, formatMLA, formatBibtex, formatRIS, downloadText } from '../utils/exportCitation';

interface Props {
  articulo: Articulo;
  favoritoId?: string;
  onFavoritoChange?: () => void;
  /** 'journal' = compact list row; default = card */
  variant?: 'journal';
}

const BADGE_COLORS: Record<string, string> = {
  arxiv: 'badge-arxiv',
  crossref: 'badge-crossref',
  openalex: 'badge-openalex',
};

const FUENTE_LABEL: Record<string, string> = {
  arxiv: 'arXiv',
  crossref: 'CrossRef',
  openalex: 'OpenAlex',
};

// arXiv category codes → full readable names
const ARXIV_CAT: Record<string, string> = {
  'cs.AI': 'Artificial Intelligence', 'cs.CL': 'Computation and Language',
  'cs.CV': 'Computer Vision', 'cs.CR': 'Cryptography and Security',
  'cs.DS': 'Data Structures and Algorithms', 'cs.HC': 'Human-Computer Interaction',
  'cs.IR': 'Information Retrieval', 'cs.IT': 'Information Theory',
  'cs.LG': 'Machine Learning', 'cs.LO': 'Logic in Computer Science',
  'cs.NI': 'Networking and Internet Architecture', 'cs.RO': 'Robotics',
  'cs.SE': 'Software Engineering', 'cs.SY': 'Systems and Control',
  'math.AG': 'Algebraic Geometry', 'math.CO': 'Combinatorics',
  'math.NA': 'Numerical Analysis', 'math.OC': 'Optimization and Control',
  'math.PR': 'Probability', 'math.ST': 'Statistics Theory',
  'physics.ao-ph': 'Atmospheric and Oceanic Physics',
  'quant-ph': 'Quantum Physics', 'cond-mat': 'Condensed Matter',
  'hep-th': 'High Energy Physics - Theory', 'astro-ph': 'Astrophysics',
  'q-bio': 'Quantitative Biology', 'econ.GN': 'General Economics',
  'stat.ML': 'Machine Learning (Statistics)',
};

const ArticuloCard = ({ articulo, favoritoId, onFavoritoChange, variant }: Props) => {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input')) return;
    navigate(`/articulo/${articulo.fuente}/${encodeURIComponent(articulo.id)}`);
  };
  const [expandido, setExpandido] = useState(false);
  const [mostraDivulgativo, setMostraDivulgativo] = useState(false);
  const [guardado, setGuardado] = useState(!!favoritoId);
  const [favId, setFavId] = useState(favoritoId);
  const [loadingFav, setLoadingFav] = useState(false);
  const [showMore, setShowMore] = useState(false);
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
    setShowMore(false);
  };

  const abstractTexto = mostraDivulgativo && articulo.abstractDivulgativo
    ? articulo.abstractDivulgativo
    : articulo.abstract;

  // ── Journal variant (compact list row) ──────────────────────────────────
  if (variant === 'journal') {
    return (
      <article className="articulo-card-journal">
        <div className="articulo-card-journal-top">
          <Link
            to={`/articulo/${articulo.fuente}/${encodeURIComponent(articulo.id)}`}
            className="articulo-card-journal-title"
          >
            {articulo.titulo}
          </Link>
          {usuario && (
            <button onClick={handleFavorito} disabled={loadingFav} className="btn-link" title={guardado ? 'Quitar favorito' : 'Guardar'}>
              {guardado ? <BookmarkCheck size={15} className="text-amber-500" /> : <Bookmark size={15} />}
            </button>
          )}
        </div>
        <div className="articulo-card-journal-meta">
          <span className={`badge ${BADGE_COLORS[articulo.fuente] || 'badge-default'}`}>
            {FUENTE_LABEL[articulo.fuente] || articulo.fuente}
          </span>
          {articulo.autores.length > 0 && (
            <span>{articulo.autores.slice(0, 3).join(', ')}{articulo.autores.length > 3 ? ' et al.' : ''}</span>
          )}
          {articulo.anio && <span>{articulo.anio}</span>}
          {articulo.citaciones !== undefined && articulo.citaciones > 0 && (
            <span>{articulo.citaciones} citas</span>
          )}
          {articulo.revista && <span>{articulo.revista}</span>}
        </div>
        {articulo.abstract && (
          <p className="articulo-card-journal-abstract">{articulo.abstract}</p>
        )}
        {articulo.palabrasClave.length > 0 && (
          <div className="articulo-card-journal-tags">
            {articulo.palabrasClave.slice(0, 4).map((kw, i) => (
              <span
                key={`${kw}-${i}`}
                className="articulo-card-journal-tag"
                title={ARXIV_CAT[kw] ?? kw}
              >{ARXIV_CAT[kw] ? kw : kw}</span>
            ))}
          </div>
        )}
      </article>
    );
  }

  return (
    <article
      className="articulo-card"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Visual cover band */}
      <div className={`articulo-card-cover cover-${articulo.fuente}`}>
        <div className="articulo-card-header">
          <span className={`badge ${BADGE_COLORS[articulo.fuente] || 'badge-default'}`}>
            {FUENTE_LABEL[articulo.fuente] || articulo.fuente}
          </span>
          {articulo.anio && <span className="cover-meta">{articulo.anio}</span>}
          {articulo.citaciones !== undefined && articulo.citaciones > 0 && (
            <span className="cover-meta">📊 {articulo.citaciones} citas</span>
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
            {articulo.autores.length > 4 && ` +${articulo.autores.length - 4} más`}
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
                {expandido ? <><ChevronUp size={14} /> Ver menos</> : <><ChevronDown size={14} /> Ver más</>}
              </button>
            )}
          </div>
        )}

        {articulo.palabrasClave.length > 0 && (
          <div className="articulo-tags">
            {articulo.palabrasClave.slice(0, 5).map((kw, i) => (
              <span
                key={`${kw}-${i}`}
                className="tag"
                title={ARXIV_CAT[kw] ?? undefined}
              >
                {ARXIV_CAT[kw] ?? kw}
              </span>
            ))}
          </div>
        )}

        {/* Acciones */}
        <div className="articulo-acciones">
          <a href={articulo.urlOriginal} target="_blank" rel="noreferrer" className="btn-link">
            <ExternalLink size={14} /> Ver artículo
          </a>

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

          {/* More actions */}
          <div className="card-more-wrapper">
            <button
              onClick={() => setShowMore(!showMore)}
              className="btn-link card-more-btn"
              title="Más acciones"
            >
              <MoreHorizontal size={16} />
            </button>
            {showMore && (
              <div className="card-more-menu">
                {articulo.urlPdf && (
                  <a href={articulo.urlPdf} target="_blank" rel="noreferrer" className="card-more-option">
                    <FileText size={13} /> PDF
                  </a>
                )}
                <button onClick={handleCopyAPA} className="card-more-option">
                  {copied ? <CheckCheck size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  {copied ? 'Copiado' : 'Citar APA'}
                </button>
                <button onClick={handleShare} className="card-more-option">
                  <Share2 size={13} /> Compartir
                </button>
                <div className="card-more-divider" />
                <button onClick={() => { handleExport('bibtex'); setShowMore(false); }} className="card-more-option">
                  <Download size={13} /> BibTeX (.bib)
                </button>
                <button onClick={() => { handleExport('ris'); setShowMore(false); }} className="card-more-option">
                  <Download size={13} /> RIS (.ris)
                </button>
                <button onClick={() => { handleExport('apa'); setShowMore(false); }} className="card-more-option">
                  <Download size={13} /> APA (.txt)
                </button>
                <button onClick={() => { handleExport('mla'); setShowMore(false); }} className="card-more-option">
                  <Download size={13} /> MLA (.txt)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticuloCard;
