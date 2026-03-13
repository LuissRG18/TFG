import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Loader2, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { actualizarPerfilRequest, cambiarPasswordRequest } from '../services/authService';
import { AREAS_CIENTIFICAS } from '../types';

const PerfilPage = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [areasInteres, setAreasInteres] = useState<string[]>(usuario?.areasInteres || []);
  const [loadingPerfil, setLoadingPerfil] = useState(false);
  const [okPerfil, setOkPerfil] = useState('');
  const [errorPerfil, setErrorPerfil] = useState('');

  const [pwActual, setPwActual] = useState('');
  const [pwNueva, setPwNueva] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [loadingPw, setLoadingPw] = useState(false);
  const [okPw, setOkPw] = useState('');
  const [errorPw, setErrorPw] = useState('');

  useEffect(() => {
    if (!usuario) navigate('/login');
  }, [usuario, navigate]);

  const toggleArea = (id: string) => {
    setAreasInteres((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handlePerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPerfil(true);
    setErrorPerfil('');
    setOkPerfil('');
    try {
      await actualizarPerfilRequest({ nombre, areasInteres });
      setOkPerfil('Perfil actualizado correctamente.');
      // Actualizar localStorage
      const stored = localStorage.getItem('scilens_usuario');
      if (stored) {
        const u = JSON.parse(stored);
        localStorage.setItem('scilens_usuario', JSON.stringify({ ...u, nombre, areasInteres }));
      }
    } catch {
      setErrorPerfil('No se pudo actualizar el perfil.');
    } finally {
      setLoadingPerfil(false);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwNueva !== pwConfirm) { setErrorPw('Las contraseñas no coinciden.'); return; }
    setLoadingPw(true);
    setErrorPw('');
    setOkPw('');
    try {
      await cambiarPasswordRequest(pwActual, pwNueva);
      setOkPw('Contraseña cambiada correctamente.');
      setPwActual(''); setPwNueva(''); setPwConfirm('');
    } catch {
      setErrorPw('La contraseña actual no es correcta.');
    } finally {
      setLoadingPw(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page-container perfil-page">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <User size={28} className="text-indigo-500" />
          <h1 className="page-title">Mi Perfil</h1>
        </div>
        <p className="page-subtitle">{usuario?.email}</p>
      </div>

      <div className="perfil-grid">
        {/* ── Datos personales ─────────────────── */}
        <div className="perfil-card">
          <h2 className="perfil-section-title">Información personal</h2>

          {okPerfil && <div className="success-banner"><CheckCircle2 size={15} /> {okPerfil}</div>}
          {errorPerfil && <div className="error-banner"><AlertCircle size={15} /> {errorPerfil}</div>}

          <form onSubmit={handlePerfil} className="auth-form">
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Áreas de interés</label>
              <div className="filter-areas">
                {AREAS_CIENTIFICAS.map((a) => (
                  <button
                    type="button"
                    key={a.id}
                    onClick={() => toggleArea(a.id)}
                    className={`filter-btn ${areasInteres.includes(a.id) ? 'active' : ''}`}
                  >
                    {a.emoji} {a.label}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loadingPerfil} className="btn-primary">
              {loadingPerfil ? <Loader2 size={16} className="animate-spin" /> : 'Guardar cambios'}
            </button>
          </form>
        </div>

        {/* ── Cambiar contraseña ────────────────── */}
        <div className="perfil-card">
          <h2 className="perfil-section-title"><Lock size={18} className="inline mr-2" />Cambiar contraseña</h2>

          {okPw && <div className="success-banner"><CheckCircle2 size={15} /> {okPw}</div>}
          {errorPw && <div className="error-banner"><AlertCircle size={15} /> {errorPw}</div>}

          <form onSubmit={handlePassword} className="auth-form">
            <div className="form-group">
              <label className="form-label">Contraseña actual</label>
              <input type="password" value={pwActual} onChange={(e) => setPwActual(e.target.value)} required className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Nueva contraseña</label>
              <input type="password" value={pwNueva} onChange={(e) => setPwNueva(e.target.value)} required minLength={6} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar nueva contraseña</label>
              <input type="password" value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)} required className="form-input" />
            </div>
            <button type="submit" disabled={loadingPw} className="btn-primary">
              {loadingPw ? <Loader2 size={16} className="animate-spin" /> : 'Cambiar contraseña'}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8">
        <button onClick={handleLogout} className="btn-danger">Cerrar sesión</button>
      </div>
    </div>
  );
};

export default PerfilPage;

