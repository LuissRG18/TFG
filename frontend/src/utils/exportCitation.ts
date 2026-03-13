import type { Articulo } from '../types';

// ── APA ──────────────────────────────────────────────────────────
export const formatAPA = (a: Articulo): string => {
  const autores = a.autores.length > 0
    ? a.autores.map((autor) => {
        const partes = autor.trim().split(' ');
        const apellido = partes[partes.length - 1];
        const iniciales = partes.slice(0, -1).map((n) => `${n[0]}.`).join(' ');
        return iniciales ? `${apellido}, ${iniciales}` : apellido;
      }).join(', ')
    : 'Autor desconocido';
  const anio = a.anio ? `(${a.anio})` : '(s.f.)';
  const revista = a.revista ? ` *${a.revista}*.` : '';
  const url = a.urlOriginal ? ` ${a.urlOriginal}` : '';
  return `${autores} ${anio}. ${a.titulo}.${revista}${url}`;
};

// ── MLA ──────────────────────────────────────────────────────────
export const formatMLA = (a: Articulo): string => {
  const autores = a.autores.length > 0
    ? a.autores.slice(0, 3).join(', ') + (a.autores.length > 3 ? ', et al.' : '')
    : 'Autor desconocido';
  const anio = a.anio ? `, ${a.anio}` : '';
  const revista = a.revista ? `"${a.titulo}." *${a.revista}*${anio}.` : `"${a.titulo}"${anio}.`;
  return `${autores}. ${revista} ${a.urlOriginal}`;
};

// ── BibTeX ───────────────────────────────────────────────────────
export const formatBibtex = (a: Articulo): string => {
  const key = (a.autores[0]?.split(' ').pop() ?? 'Anon') + (a.anio ?? 'XX');
  const autores = a.autores.join(' and ');
  const journal = a.revista ? `  journal   = {${a.revista}},\n` : '';
  return `@article{${key},
  title     = {${a.titulo}},
  author    = {${autores}},
  year      = {${a.anio ?? ''}},
${journal}  url       = {${a.urlOriginal}},
  note      = {[${a.fuente}]}
}`;
};

// ── RIS ──────────────────────────────────────────────────────────
export const formatRIS = (a: Articulo): string => {
  const autores = a.autores.map((au) => `AU  - ${au}`).join('\n');
  const journal = a.revista ? `JO  - ${a.revista}\n` : '';
  return `TY  - JOUR
TI  - ${a.titulo}
${autores}
PY  - ${a.anio ?? ''}
${journal}UR  - ${a.urlOriginal}
ER  - `;
};

// ── Download helper ──────────────────────────────────────────────
export const downloadText = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
