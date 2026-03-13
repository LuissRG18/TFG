import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FlaskConical, Search, BookMarked, BarChart2, LogIn, LogOut, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link${isActive ? ' nav-link-active' : ''}`;

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <FlaskConical size={24} style={{ color: 'var(--accent)' }} />
          <span>Sci<span style={{ color: 'var(--accent)' }}>Lens</span></span>
        </Link>

        {/* Desktop links */}
        <div className="navbar-links">
          <NavLink to="/buscar" className={navLinkClass}>
            <Search size={16} /> Explorar
          </NavLink>
          <NavLink to="/areas" className={navLinkClass}>
            <FlaskConical size={16} /> Áreas
          </NavLink>
          {usuario && (
            <>
              <NavLink to="/favoritos" className={navLinkClass}>
                <BookMarked size={16} /> Favoritos
              </NavLink>
              <NavLink to="/estadisticas" className={navLinkClass}>
                <BarChart2 size={16} /> Estadísticas
              </NavLink>
            </>
          )}
        </div>

        {/* Auth */}
        <div className="navbar-auth">
          {usuario ? (
            <div className="flex items-center gap-2">
              <NavLink to="/perfil" className={navLinkClass}>
                <User size={16} /> {usuario.nombre.split(' ')[0]}
              </NavLink>
              <button onClick={handleLogout} className="btn-outline-sm">
                <LogOut size={15} /> Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-outline-sm">
                <LogIn size={15} /> Entrar
              </Link>
              <Link to="/registro" className="btn-primary-sm">
                Registrarse
              </Link>
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
          <NavLink to="/buscar" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            <Search size={16} /> Explorar
          </NavLink>
          <NavLink to="/areas" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            <FlaskConical size={16} /> Áreas
          </NavLink>
          {usuario && (
            <>
              <NavLink to="/favoritos" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                <BookMarked size={16} /> Favoritos
              </NavLink>
              <NavLink to="/estadisticas" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                <BarChart2 size={16} /> Estadísticas
              </NavLink>
              <NavLink to="/perfil" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                <User size={16} /> Perfil
              </NavLink>
            </>
          )}
          {!usuario && (
            <>
              <Link to="/login" className={navLinkClass({ isActive: false })} onClick={() => setMenuOpen(false)}>
                <LogIn size={16} /> Entrar
              </Link>
              <Link to="/registro" className={navLinkClass({ isActive: false })} onClick={() => setMenuOpen(false)}>
                Registrarse
              </Link>
            </>
          )}
          {usuario && (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg">
              <LogOut size={16} /> Cerrar sesión
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

