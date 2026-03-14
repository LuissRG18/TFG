import api from './api';
import type { Articulo, EstadisticasGlobales, Usuario } from '../types';

export interface BusquedaParams {
  q: string;
  area?: string;
  pagina?: number;
  limite?: number;
  anioDesde?: number;
  anioHasta?: number;
  minCitas?: number;
  autor?: string;
  orden?: 'relevancia' | 'anio' | 'citas';
}

export interface ResultadoBusqueda {
  ok: boolean;
  total: number;
  articulos: Articulo[];
}

export const buscarArxiv = async (params: BusquedaParams): Promise<ResultadoBusqueda> => {
  const { data } = await api.get('/articulos/arxiv/buscar', { params });
  return data;
};

export const obtenerArxivPorId = async (id: string): Promise<{ ok: boolean; articulo: Articulo }> => {
  const { data } = await api.get(`/articulos/arxiv/${encodeURIComponent(id)}`);
  return data;
};

export const buscarCrossRef = async (params: BusquedaParams): Promise<ResultadoBusqueda> => {
  const { data } = await api.get('/articulos/crossref/buscar', { params });
  return data;
};

export const obtenerEstadisticas = async () => {
  const { data } = await api.get('/articulos/estadisticas');
  return data;
};

// ── Admin ───────────────────────────────────────────────────────
export const obtenerUsuariosAdmin = async () => {
  const { data } = await api.get('/usuarios');
  return data as { ok: boolean; total: number; usuarios: Usuario[] };
};

export const cambiarEstadoUsuario = async (id: string) => {
  const { data } = await api.put(`/usuarios/${id}/estado`);
  return data;
};

export const eliminarUsuarioAdmin = async (id: string) => {
  const { data } = await api.delete(`/usuarios/${id}`);
  return data;
};

export const obtenerEstadisticasGlobales = async () => {
  const { data } = await api.get('/usuarios/estadisticas');
  return data as { ok: boolean; estadisticas: EstadisticasGlobales };
};

// ── Avatar ──────────────────────────────────────────────────────
export const subirAvatar = async (file: File) => {
  const form = new FormData();
  form.append('avatar', file);
  const { data } = await api.post('/auth/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data as { ok: boolean; avatar: string };
};

