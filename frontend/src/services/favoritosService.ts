import api from './api';
import type { Favorito, Articulo } from '../types';

export interface AgregarFavoritoPayload extends Articulo {
  notas?: string;
  etiquetas?: string[];
}

export const obtenerFavoritos = async (params?: {
  area?: string;
  fuente?: string;
  etiqueta?: string;
  leidoMasTarde?: boolean;
  pagina?: number;
  limite?: number;
}) => {
  const { data } = await api.get('/favoritos', { params });
  return data as { ok: boolean; total: number; favoritos: Favorito[] };
};

export const agregarFavorito = async (payload: AgregarFavoritoPayload) => {
  const { data } = await api.post('/favoritos', payload);
  return data;
};

export const eliminarFavorito = async (id: string) => {
  const { data } = await api.delete(`/favoritos/${id}`);
  return data;
};

export const actualizarFavorito = async (
  id: string,
  payload: { notas?: string; etiquetas?: string[]; leidoMasTarde?: boolean }
) => {
  const { data } = await api.put(`/favoritos/${id}`, payload);
  return data;
};

export const checkFavorito = async (articuloId: string) => {
  const { data } = await api.get(`/favoritos/check/${articuloId}`);
  return data as { ok: boolean; esFavorito: boolean; favorito?: Favorito };
};

