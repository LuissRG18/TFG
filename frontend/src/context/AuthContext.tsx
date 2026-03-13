import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthContextType, Usuario } from '../types';
import { loginRequest, registroRequest } from '../services/authService';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('scilens_token');
    const storedUser = localStorage.getItem('scilens_usuario');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUsuario(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginRequest(email, password);
    if (!data.ok) throw new Error(data.mensaje);
    setToken(data.token);
    setUsuario(data.usuario);
    localStorage.setItem('scilens_token', data.token);
    localStorage.setItem('scilens_usuario', JSON.stringify(data.usuario));
  };

  const registro = async (nombre: string, email: string, password: string) => {
    const data = await registroRequest(nombre, email, password);
    if (!data.ok) throw new Error(data.mensaje);
    setToken(data.token);
    setUsuario(data.usuario);
    localStorage.setItem('scilens_token', data.token);
    localStorage.setItem('scilens_usuario', JSON.stringify(data.usuario));
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('scilens_token');
    localStorage.removeItem('scilens_usuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, registro, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};

