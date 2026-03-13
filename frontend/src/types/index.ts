// ─── Artículo científico ───────────────────────────────────────────────────
export interface Articulo {
  id: string;
  fuente: 'arxiv' | 'crossref';
  titulo: string;
  autores: string[];
  anio: number | null;
  abstract: string;
  abstractDivulgativo?: string;
  palabrasClave: string[];
  urlOriginal: string;
  urlPdf?: string;
  revista?: string;
  citaciones?: number;
  referencias?: number;
  citadoPor?: number;
  area?: string;
}

// ─── Usuario ───────────────────────────────────────────────────────────────
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'user' | 'admin';
  areasInteres: string[];
  avatar?: string;
}

// ─── Favorito guardado en BD ───────────────────────────────────────────────
export interface Favorito extends Articulo {
  _id: string;
  notas?: string;
  etiquetas?: string[];
  leidoMasTarde?: boolean;
  createdAt: string;
}

// ─── Auth context ──────────────────────────────────────────────────────────
export interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  registro: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// ─── Estadísticas ──────────────────────────────────────────────────────────
export interface Estadisticas {
  totalFavoritos: number;
  porAnio: { _id: number; total: number }[];
  porArea: { _id: string; total: number }[];
  porFuente: { _id: string; total: number }[];
}

// ─── Áreas científicas ─────────────────────────────────────────────────────
export const AREAS_CIENTIFICAS = [
  { id: 'cs', label: 'Informática', emoji: '💻' },
  { id: 'medicine', label: 'Medicina', emoji: '🏥' },
  { id: 'physics', label: 'Física', emoji: '⚛️' },
  { id: 'biology', label: 'Biología', emoji: '🧬' },
  { id: 'mathematics', label: 'Matemáticas', emoji: '📐' },
  { id: 'chemistry', label: 'Química', emoji: '🧪' },
  { id: 'economics', label: 'Economía', emoji: '📈' },
  { id: 'psychology', label: 'Psicología', emoji: '🧠' },
] as const;

