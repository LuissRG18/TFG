import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
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
    setLoadingPerfil(true); setErrorPerfil(''); setOkPerfil('');
    try {
      await actualizarPerfilRequest({ nombre, areasInteres });
      setOkPerfil('Perfil actualizado correctamente.');
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
    if (pwNueva !== pwConfirm) { setErrorPw('Las contraseÃ±as no coinciden.'); return; }
    setLoadingPw(true); setErrorPw(''); setOkPw('');
    try {
      await cambiarPasswordRequest(pwActual, pwNueva);
      setOkPw('ContraseÃ±a cambiada correctamente.');
      setPwActual(''); setPwNueva(''); setPwConfirm('');
    } catch {
      setErrorPw('La contraseÃ±a actual no es correcta.');
    } finally {
      setLoadingPw(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const initial = usuario?.nombre?.charAt(0).toUpperCase() ?? '?';

  return (
    <div className="perfil-page">
      <div className="perfil-page-header">
        <div className="perfil-page-header-inner">
          <p className="section-eyebrow">CUENTA</p>
          <h1 className="perfil-page-title">Mi perfil</h1>
        </div>
      </div>

      <div className="perfil-layout">
        {/* â”€â”€ LEFT column â”€â”€ */}
        <div className="perfil-left">
          {/* Avatar */}
          <div className="perfil-avatar-section">
            <div className="perfil-avatar-circle">{initial}</div>
            <div>
              <p className="perfil-avatar-name">{usuario?.nombre}</p>
              <p className="perfil-avatar-email">{usuario?.email}</p>
            </div>
          </div>

          {/* Personal info form */}
          <div className="perfil-card">
            <h2 className="perfil-section-title">InformaciÃ³n personal</h2>
            {okPerfil && <div className="success-banner"><CheckCircle2 size={15} /> {okPerfil}</div>}
            {errorPerfil && <div className="error-banner"><AlertCircle size={15} /> {errorPerfil}</div>}
            <form onSubmit={handlePerfil} className="auth-form">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" value={usuario?.email || ''} disabled className="form-input" />
              </div>
              <button type="submit" disabled={loadingPerfil} className="btn-primary">
                {loadingPerfil ? <Loader2 size={16} className="animate-spin" /> : 'Guardar cambios'}
              </button>
            </form>
          </div>

          {/* Interest areas */}
          <div className="perfil-card">
            <h2 className="perfil-section-title">Ãreas de interÃ©s</h2>
            <div className="perfil-areas-grid">
              {AREAS_CIENTIFICAS.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => toggleArea(a.id)}
                  className={`perfil-area-btn ${areasInteres.includes(a.id) ? 'active' : ''}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* â”€â”€ RIGHT column â”€â”€ */}
        <div className="perfil-right">
          {/* Change password */}
          <div className="perfil-card">
            <h2 className="perfil-section-title">ðŸ”’ Cambiar contraseÃ±a</h2>
            {okPw && <div className="success-banner"><CheckCircle2 size={15} /> {okPw}</div>}
            {errorPw && <div className="error-banner"><AlertCircle size={15} /> {errorPw}</div>}
            <form onSubmit={handlePassword} className="auth-form">
              <div className="form-group">
                <label className="form-label">ContraseÃ±a actual</label>
                <input type="password" value={pwActual} onChange={(e) => setPwActual(e.target.value)} required className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Nueva contraseÃ±a</label>
                <input type="password" value={pwNueva} onChange={(e) => setPwNueva(e.target.value)} required minLength={6} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirmar nueva contraseÃ±a</label>
                <input type="password" value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)} required className="form-input" />
              </div>
              <button type="submit" disabled={loadingPw} className="btn-primary">
                {loadingPw ? <Loader2 size={16} className="animate-spin" /> : 'Cambiar contraseÃ±a'}
              </button>
            </form>
          </div>

          {/* Preferences */}
          <div className="perfil-card">
            <h2 className="perfil-section-title">Preferencias</h2>
            <div className="form-group">
              <label className="form-label">Idioma de la interfaz</label>
              <select className="form-input">
                <option value="es">EspaÃ±ol</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tema</label>
              <select className="form-input">
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="system">Sistema</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Idioma de noticias</label>
              <select className="form-input">
                <option value="es">EspaÃ±ol</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Danger zone */}
          <div className="perfil-card perfil-danger-zone">
            <h2 className="perfil-section-title danger">Zona peligrosa</h2>
            <p className="perfil-danger-desc">Estas acciones son irreversibles. Procede con precauciÃ³n.</p>
            <div className="perfil-danger-actions">
              <button onClick={handleLogout} className="btn-danger-outline">Cerrar sesiÃ³n</button>
              <button className="btn-danger" onClick={() => {
                if (window.confirm('Â¿Seguro que quieres eliminar tu cuenta? Esta acciÃ³n no se puede deshacer.')) {
                  // TODO: implement account deletion
                }
              }}>Eliminar cuenta</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
