import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--split">
      {/* Left: form */}
      <div className="auth-split-form">
        <div className="auth-card">
          <p className="section-eyebrow">Bienvenido de nuevo</p>
          <h1 className="auth-title">Inicia sesión en SciLens</h1>
          <p className="auth-subtitle">Accede a tus favoritos, historial, estadísticas y recomendaciones personalizadas.</p>

          {error && (
            <div className="error-banner">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="form-input"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Acceder →'}
            </button>
          </form>

          <p className="auth-footer-text">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/registro" className="auth-link">Crear cuenta</Link>
          </p>
        </div>
      </div>

      {/* Right: Oxford panel */}
      <div className="auth-split-panel">
        <div className="auth-panel-content">
          <div className="navbar-logo-icon" style={{ marginBottom: '1.5rem', width: 36, height: 36, fontSize: '1rem' }}>S</div>
          <blockquote className="auth-panel-quote">
            "La ciencia avanza encogiendo los hombros de gigantes."
          </blockquote>
          <p className="auth-panel-desc">
            Centraliza arXiv, CrossRef y noticias científicas en una sola interfaz diseñada para investigar, comparar y recordar.
          </p>
          <div className="auth-panel-stats">
            <div><span className="auth-stat-number">2.4M+</span><span className="auth-stat-label">Artículos</span></div>
            <div><span className="auth-stat-number">12</span><span className="auth-stat-label">Áreas</span></div>
            <div><span className="auth-stat-number">100%</span><span className="auth-stat-label">Open</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

