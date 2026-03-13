import api from './api';

export const loginRequest = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const registroRequest = async (nombre: string, email: string, password: string) => {
  const { data } = await api.post('/auth/registro', { nombre, email, password });
  return data;
};

export const obtenerPerfilRequest = async () => {
  const { data } = await api.get('/auth/perfil');
  return data;
};

export const actualizarPerfilRequest = async (payload: {
  nombre?: string;
  avatar?: string;
  areasInteres?: string[];
}) => {
  const { data } = await api.put('/auth/perfil', payload);
  return data;
};

export const cambiarPasswordRequest = async (passwordActual: string, passwordNueva: string) => {
  const { data } = await api.put('/auth/cambiar-password', { passwordActual, passwordNueva });
  return data;
};

