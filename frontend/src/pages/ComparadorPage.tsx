import { useState } from 'react';
import { X, Loader2, Search, Plus, ListChecks, BarChart2 } from 'lucide-react';
import { buscarArxiv, buscarCrossRef, buscarOpenAlex } from '../services/articulosService';
import type { Articulo } from '../types';

const MAX_COMPARE = 3;

const ComparadorPage = () => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<Articulo[]>([]);
  const [seleccionados, setSeleccionados] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fuente, setFuente] = useState<'arxiv' | 'crossref' | 'openalex'>('arxiv');

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const fn = fuente === 'arxiv' ? buscarArxiv
        : fuente === 'openalex' ? buscarOpenAlex
        : buscarCrossRef;
      const res = await fn({ q: query, limite: 10 });
      setResultados(res.articulos);
    } catch {
      setError('Error al buscar artículos.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSeleccion = (art: Articulo) => {
    setSeleccionados((prev) => {
      const existe = prev.find((a) => a.id === art.id);
      if (existe) return prev.filter((a) => a.id !== art.id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, art];
    });
  };

  const estaSeleccionado = (art: Articulo) => seleccionados.some((a) => a.id === art.id);

  return (
    <div className="comparador-page">
      {/* ── Hero ── */}
      <div className="inner-page-hero">
        <div className="inner-page-hero-inner">
          <p className="section-eyebrow">HERRAMIENTAS</p>
          <h1 className="inner-page-hero-title">Comparador de Artículos</h1>
          <p className="inner-page-hero-subtitle">Selecciona hasta {MAX_COMPARE} artículos para comparar</p>
        </div>
      </div>

      <div className="inner-page-content">
      {/* Búsqueda */}
      <form onSubmit={buscar} className="comparador-search-row">
        <div className="buscar-filters-bar" style={{ marginBottom: 0 }}>
          <button type="button" onClick={() => setFuente('arxiv')} className={`filter-btn ${fuente === 'arxiv' ? 'active' : ''}`}>arXiv</button>
          <button type="button" onClick={() => setFuente('crossref')} className={`filter-btn ${fuente === 'crossref' ? 'active' : ''}`}>CrossRef</button>
          <button type="button" onClick={() => setFuente('openalex')} className={`filter-btn ${fuente === 'openalex' ? 'active' : ''}`}>OpenAlex</button>
        </div>
        <div className="search-bar page-container" style={{ padding: 0, maxWidth: '100%' }}>
          <Search size={16} className="search-icon" />
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca artículos para comparar..."
          />
          <button type="submit" className="btn-primary-sm">Buscar</button>
        </div>
      </form>

      {loading && <div className="loading-state"><Loader2 size={28} className="animate-spin text-indigo-500" /></div>}
      {error && <div className="error-banner">{error}</div>}

      {/* Empty state — no search done yet */}
      {!loading && resultados.length === 0 && seleccionados.length === 0 && (
        <div className="comparador-empty">
          {/* Step-by-step instructions */}
          <div className="comparador-steps">
            <div className="comparador-step">
              <div className="comparador-step-icon"><Search size={20} /></div>
              <div>
                <p className="comparador-step-num">1</p>
                <p className="comparador-step-label">Busca un artículo</p>
              </div>
            </div>
            <div className="comparador-step-arrow">→</div>
            <div className="comparador-step">
              <div className="comparador-step-icon"><ListChecks size={20} /></div>
              <div>
                <p className="comparador-step-num">2</p>
                <p className="comparador-step-label">Añádelo al comparador</p>
              </div>
            </div>
            <div className="comparador-step-arrow">→</div>
            <div className="comparador-step">
              <div className="comparador-step-icon"><BarChart2 size={20} /></div>
              <div>
                <p className="comparador-step-num">3</p>
                <p className="comparador-step-label">Compara los resultados</p>
              </div>
            </div>
          </div>

          {/* 3 visual slots */}
          <div className="comparador-slots">
            {[1, 2, 3].map((n) => (
              <div key={n} className="comparador-slot">
                <Plus size={28} className="comparador-slot-plus" />
                <span className="comparador-slot-label">Artículo {n}</span>
              </div>
            ))}
          </div>

          {/* Greyed-out table preview */}
          <div className="comparador-preview">
            <p className="comparador-preview-label">Vista previa de la comparativa</p>
            <div className="comparador-preview-table">
              <div className="comparador-preview-header">
                <span className="comparador-preview-field">Campo</span>
                <span className="comparador-preview-col">Artículo 1</span>
                <span className="comparador-preview-col">Artículo 2</span>
                <span className="comparador-preview-col">Artículo 3</span>
              </div>
              {['Año', 'Autores', 'Revista', 'Citas', 'Palabras clave'].map((f) => (
                <div key={f} className="comparador-preview-row">
                  <span className="comparador-preview-field">{f}</span>
                  <span className="comparador-preview-col comparador-preview-blur">—</span>
                  <span className="comparador-preview-col comparador-preview-blur">—</span>
                  <span className="comparador-preview-col comparador-preview-blur">—</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selector de artículos */}
      {resultados.length > 0 && (
        <div className="comparador-picker">
          <p className="text-sm text-gray-500 mb-3">
            Seleccionados: <strong>{seleccionados.length}</strong> / {MAX_COMPARE}
          </p>
          <div className="comparador-picker-list">
            {resultados.map((art) => {
              const sel = estaSeleccionado(art);
              return (
                <div
                  key={art.id}
                  className={`comparador-picker-item ${sel ? 'selected' : ''}`}
                  onClick={() => toggleSeleccion(art)}
                >
                  <input type="checkbox" checked={sel} readOnly className="mr-2" />
                  <div>
                    <p className="text-sm font-semibold line-clamp-2">{art.titulo}</p>
                    <p className="text-xs text-gray-500">
                      {art.autores.slice(0, 2).join(', ')} · {art.anio || '—'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabla comparativa */}
      {seleccionados.length >= 2 && (
        <div className="comparador-table-wrapper mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">Comparativa</h2>
            <button onClick={() => setSeleccionados([])} className="btn-outline-sm">
              <X size={13} /> Limpiar
            </button>
          </div>
          <div className="comparador-table-scroll">
            <table className="comparador-table">
              <thead>
                <tr>
                  <th className="comparador-th-label">Campo</th>
                  {seleccionados.map((art) => (
                    <th key={art.id}>
                      <div className="comparador-th-title">{art.titulo.substring(0, 60)}{art.titulo.length > 60 ? '…' : ''}</div>
                      <button onClick={() => toggleSeleccion(art)} className="btn-danger-sm mt-1">
                        <X size={11} /> Quitar
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="comparador-field">Año</td>
                  {seleccionados.map((a) => <td key={a.id}>{a.anio || '—'}</td>)}
                </tr>
                <tr>
                  <td className="comparador-field">Autores</td>
                  {seleccionados.map((a) => (
                    <td key={a.id}>{a.autores.slice(0, 3).join(', ')}{a.autores.length > 3 ? ` +${a.autores.length - 3}` : ''}</td>
                  ))}
                </tr>
                <tr>
                  <td className="comparador-field">Fuente</td>
                  {seleccionados.map((a) => <td key={a.id}><span className="badge badge-default">{a.fuente}</span></td>)}
                </tr>
                <tr>
                  <td className="comparador-field">Revista</td>
                  {seleccionados.map((a) => <td key={a.id}>{a.revista || '—'}</td>)}
                </tr>
                <tr>
                  <td className="comparador-field">Citas</td>
                  {seleccionados.map((a) => <td key={a.id}>{a.citaciones ?? '—'}</td>)}
                </tr>
                <tr>
                  <td className="comparador-field">Palabras clave</td>
                  {seleccionados.map((a) => (
                    <td key={a.id}>
                      <div className="flex flex-wrap gap-1">
                        {a.palabrasClave.slice(0, 4).map((k) => <span key={k} className="tag">{k}</span>)}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="comparador-field">Abstract</td>
                  {seleccionados.map((a) => (
                    <td key={a.id} className="comparador-abstract">{a.abstract?.substring(0, 300) || '—'}{(a.abstract?.length ?? 0) > 300 ? '…' : ''}</td>
                  ))}
                </tr>
                <tr>
                  <td className="comparador-field">Enlace</td>
                  {seleccionados.map((a) => (
                    <td key={a.id}>
                      <a href={a.urlOriginal} target="_blank" rel="noreferrer" className="btn-link">Ver →</a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {seleccionados.length === 1 && (
        <div className="info-banner mt-4">Selecciona al menos 2 artículos para ver la comparativa.</div>
      )}
      </div>
    </div>
  );
};

export default ComparadorPage;
