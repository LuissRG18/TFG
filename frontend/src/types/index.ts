// ─── Artículo científico ───────────────────────────────────────────────────
export interface Articulo {
  id: string;
  fuente: 'arxiv' | 'crossref' | 'openalex';
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
  _id?: string;
  nombre: string;
  email: string;
  rol: 'user' | 'admin' | 'usuario';
  areasInteres: string[];
  avatar?: string;
  activo?: boolean;
  createdAt?: string;
}

// ─── Favorito guardado en BD ───────────────────────────────────────────────
export interface Favorito extends Articulo {
  _id: string;
  articuloId: string;
  notas?: string;
  etiquetas?: string[];
  leidoMasTarde?: boolean;
  coleccion?: string;
  createdAt: string;
}

// ─── Búsqueda guardada ────────────────────────────────────────────────────
export interface BusquedaHistorial {
  _id: string;
  termino: string;
  fuente: string;
  area?: string;
  resultados: number;
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
  actualizarUsuario: (u: Partial<Usuario>) => void;
}

// ─── Estadísticas ──────────────────────────────────────────────────────────
export interface Estadisticas {
  totalFavoritos: number;
  porAnio: { _id: number; total: number }[];
  porArea: { _id: string; total: number }[];
  porFuente: { _id: string; total: number }[];
}

export interface EstadisticasGlobales {
  totalUsuarios: number;
  totalActivos: number;
  totalFavoritos: number;
  totalBusquedas: number;
  usuariosPorMes: { _id: string; total: number }[];
  favoritosPorFuente: { _id: string; total: number }[];
  busquedasPorFuente: { _id: string; total: number }[];
}

// ─── Noticia científica ────────────────────────────────────────────────────
export interface Noticia {
  _id: string;
  titulo: string;
  resumen: string;
  url: string;
  imagen?: string | null;
  fuente: string;
  idioma: 'es' | 'en';
  fecha: string;
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
  { id: 'engineering', label: 'Ingeniería', emoji: '⚙️' },
  { id: 'astronomy', label: 'Astronomía', emoji: '🔭' },
  { id: 'environmental', label: 'Medio Ambiente', emoji: '🌿' },
  { id: 'neuroscience', label: 'Neurociencia', emoji: '🧫' },
] as const;

export type AreaId = typeof AREAS_CIENTIFICAS[number]['id'];

