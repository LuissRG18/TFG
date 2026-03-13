import api from './api';
import type { Articulo } from '../types';

export interface BusquedaParams {
  q: string;
  area?: string;
  pagina?: number;
  limite?: number;
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

export const buscarSemanticScholar = async (params: BusquedaParams): Promise<ResultadoBusqueda> => {
  const { data } = await api.get('/articulos/semantic/buscar', { params });
  return data;
};

export const obtenerDetalleSemanticScholar = async (paperId: string): Promise<{ ok: boolean; articulo: Articulo }> => {
  const { data } = await api.get(`/articulos/semantic/${paperId}`);
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

