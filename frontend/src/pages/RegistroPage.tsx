import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegistroPage = () => {
  const { registro } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await registro(nombre, email, password);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--split">
      {/* Left: form */}
      <div className="auth-split-form">
        <div className="auth-card">
          <p className="section-eyebrow">Únete a SciLens</p>
          <h1 className="auth-title">Crea tu cuenta gratuita</h1>
          <p className="auth-subtitle">Empieza a explorar, guardar y comparar artículos científicos hoy mismo.</p>

          {error && (
            <div className="error-banner">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Tu nombre"
                className="form-input"
              />
            </div>
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
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
                placeholder="Repite la contraseña"
                className="form-input"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Crear cuenta →'}
            </button>
          </form>

          <p className="auth-footer-text">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="auth-link">Inicia sesión</Link>
          </p>
        </div>
      </div>

      {/* Right: Oxford panel */}
      <div className="auth-split-panel">
        <div className="auth-panel-content">
          <div className="navbar-logo-icon" style={{ marginBottom: '1.5rem', width: 36, height: 36, fontSize: '1rem' }}>S</div>
          <blockquote className="auth-panel-quote">
            "Una biblioteca científica que aprende contigo."
          </blockquote>
          <ul className="auth-panel-benefits">
            <li>✓ Acceso a más de 2.4 millones de artículos en abierto</li>
            <li>✓ Artemis, tu asistente de IA integrado</li>
            <li>✓ Favoritos, historial y estadísticas personales</li>
            <li>✓ Comparador de papers y exportación de citas</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegistroPage;

