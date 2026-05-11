import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isSolid = scrolled || !isHome;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link${isActive ? ' nav-link-active' : ''}`;

  const isAdmin = usuario?.rol === 'admin';

  return (
    <nav className={`navbar${isSolid ? ' navbar--scrolled' : ''}${menuOpen ? ' navbar--open' : ''}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <svg className="navbar-logo-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="16" cy="16" r="16" fill="#1c3353"/>
            <line x1="1" y1="16" x2="5" y2="16" stroke="rgba(255,255,255,0.38)" strokeWidth="1" strokeDasharray="1.5 1.5"/>
            <line x1="27" y1="16" x2="31" y2="16" stroke="rgba(255,255,255,0.38)" strokeWidth="1" strokeDasharray="1.5 1.5"/>
            <path d="M5,16 Q16,7.5 27,16 Q16,24.5 5,16 Z" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round"/>
            <circle cx="16" cy="16" r="4.5" fill="#e67e22"/>
          </svg>
          <span className="navbar-logo-text">
            <span className="logo-sci">Sci</span><span className="logo-lens">Lens</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="navbar-links">
          <NavLink to="/" end className={navLinkClass}>Inicio</NavLink>
          <NavLink to="/buscar" className={navLinkClass}>Buscar</NavLink>
          <NavLink to="/areas" className={navLinkClass}>Áreas</NavLink>
          {!usuario && (
            <NavLink to="/artemis" className={navLinkClass}>Artemis II</NavLink>
          )}
          <NavLink to="/noticias" className={navLinkClass}>Noticias</NavLink>
          <NavLink to="/comparar" className={navLinkClass}>Comparador</NavLink>
          {usuario && (
            <>
              <NavLink to="/recomendados" className={navLinkClass}>Recomendados</NavLink>
              <NavLink to="/favoritos" className={navLinkClass}>Favoritos</NavLink>
              <NavLink to="/historial" className={navLinkClass}>Historial</NavLink>
              <NavLink to="/estadisticas" className={navLinkClass}>Estadísticas</NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
              )}
            </>
          )}
        </div>

        {/* Auth */}
        <div className="navbar-auth">
          {usuario ? (
            <div className="flex items-center gap-2">
              <NavLink to="/perfil" className={navLinkClass}>
                <span className="navbar-avatar">{usuario.nombre.charAt(0).toUpperCase()}</span>
                {usuario.nombre.split(' ')[0]}
              </NavLink>
              <button onClick={handleLogout} className="btn-outline-sm">
                <LogOut size={14} /> Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-outline-sm navbar-btn-acceder">Acceder</Link>
              <Link to="/registro" className="btn-primary-sm">Crear cuenta</Link>
            </div>
          )}
          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" end className={navLinkClass} onClick={() => setMenuOpen(false)}>Inicio</NavLink>
          <NavLink to="/buscar" className={navLinkClass} onClick={() => setMenuOpen(false)}>Buscar</NavLink>
          <NavLink to="/areas" className={navLinkClass} onClick={() => setMenuOpen(false)}>Áreas</NavLink>
          <NavLink to="/artemis" className={navLinkClass} onClick={() => setMenuOpen(false)}>Artemis II</NavLink>
          <NavLink to="/noticias" className={navLinkClass} onClick={() => setMenuOpen(false)}>Noticias</NavLink>
          <NavLink to="/comparar" className={navLinkClass} onClick={() => setMenuOpen(false)}>Comparador</NavLink>
          {usuario && (
            <>
              <NavLink to="/recomendados" className={navLinkClass} onClick={() => setMenuOpen(false)}>Recomendados</NavLink>
              <NavLink to="/favoritos" className={navLinkClass} onClick={() => setMenuOpen(false)}>Favoritos</NavLink>
              <NavLink to="/historial" className={navLinkClass} onClick={() => setMenuOpen(false)}>Historial</NavLink>
              <NavLink to="/estadisticas" className={navLinkClass} onClick={() => setMenuOpen(false)}>Estadísticas</NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={navLinkClass} onClick={() => setMenuOpen(false)}>Admin</NavLink>
              )}
              <NavLink to="/perfil" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                <User size={15} /> Perfil
              </NavLink>
            </>
          )}
          {!usuario && (
            <>
              <Link to="/login" className={navLinkClass({ isActive: false })} onClick={() => setMenuOpen(false)}>Acceder</Link>
              <Link to="/registro" className={navLinkClass({ isActive: false })} onClick={() => setMenuOpen(false)}>Crear cuenta</Link>
            </>
          )}
          {usuario && (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500">
              <LogOut size={15} /> Cerrar sesión
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
