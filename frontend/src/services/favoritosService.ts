import api from './api';
import type { Favorito, Articulo, BusquedaHistorial } from '../types';

export interface AgregarFavoritoPayload extends Articulo {
  notas?: string;
  etiquetas?: string[];
  coleccion?: string;
}

export const obtenerFavoritos = async (params?: {
  area?: string;
  fuente?: string;
  etiqueta?: string;
  leidoMasTarde?: boolean;
  coleccion?: string;
  pagina?: number;
  limite?: number;
}) => {
  const { data } = await api.get('/favoritos', { params });
  return data as { ok: boolean; total: number; totalPaginas: number; pagina: number; favoritos: Favorito[] };
};

export const agregarFavorito = async (payload: AgregarFavoritoPayload) => {
  // Backend expects 'articuloId'; Articulo type uses 'id' — map it here
  const { id, ...rest } = payload;
  const { data } = await api.post('/favoritos', { articuloId: id, ...rest });
  return data;
};

export const eliminarFavorito = async (id: string) => {
  const { data } = await api.delete(`/favoritos/${id}`);
  return data;
};

export const actualizarFavorito = async (
  id: string,
  payload: { notas?: string; etiquetas?: string[]; leidoMasTarde?: boolean; coleccion?: string }
) => {
  const { data } = await api.put(`/favoritos/${id}`, payload);
  return data;
};

export const checkFavorito = async (articuloId: string) => {
  const { data } = await api.get('/favoritos/check', { params: { id: articuloId } });
  return data as { ok: boolean; esFavorito: boolean; favorito?: Favorito };
};

// ── Historial ───────────────────────────────────────────────────
export const guardarBusqueda = async (payload: {
  termino: string; fuente: string; area?: string; resultados: number;
}) => {
  const { data } = await api.post('/favoritos/busqueda', payload);
  return data;
};

export const obtenerHistorial = async (params?: { pagina?: number; limite?: number }) => {
  const { data } = await api.get('/favoritos/busquedas', { params });
  return data as { ok: boolean; total: number; totalPaginas: number; busquedas: BusquedaHistorial[] };
};

export const eliminarBusqueda = async (id: string) => {
  const { data } = await api.delete(`/favoritos/busquedas/${id}`);
  return data;
};

// ── Colecciones ─────────────────────────────────────────────────
export const obtenerColecciones = async () => {
  const { data } = await api.get('/favoritos/colecciones');
  return data as { ok: boolean; colecciones: { _id: string; total: number }[] };
};

