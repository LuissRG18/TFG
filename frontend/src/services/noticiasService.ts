import api from './api';
import type { Noticia } from '../types';

export interface NoticiasResponse {
  ok: boolean;
  fuente: 'cache' | 'rss';
  noticias: Noticia[];
}

export const getNoticias = async (idioma: 'es' | 'en' = 'es', limite = 30): Promise<NoticiasResponse> => {
  const { data } = await api.get('/noticias', { params: { idioma, limite } });
  return data;
};
