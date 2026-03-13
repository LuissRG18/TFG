import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner" />
      </div>
    );
  }

  return usuario ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

