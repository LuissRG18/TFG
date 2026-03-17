import { FlaskConical, Github, Twitter, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">

      {/* Brand */}
      <div className="footer-brand">
        <div className="footer-logo">
          <FlaskConical size={22} />
          <span>Sci<span className="footer-logo-accent">Lens</span></span>
        </div>
        <p className="footer-tagline">
          Descubre, comprende y guarda artículos científicos de acceso abierto desde cualquier lugar.
        </p>
        <div className="footer-socials">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="footer-social-link" aria-label="GitHub">
            <Github size={17} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-social-link" aria-label="Twitter">
            <Twitter size={17} />
          </a>
          <a href="mailto:contact@scilens.app" className="footer-social-link" aria-label="Email">
            <Mail size={17} />
          </a>
        </div>
      </div>

      {/* Explorar */}
      <div className="footer-col">
        <h4 className="footer-col-title">Explorar</h4>
        <ul className="footer-links">
          <li><Link to="/buscar">Buscar artículos</Link></li>
          <li><Link to="/areas">Áreas científicas</Link></li>
          <li><Link to="/recomendados">Recomendados</Link></li>
          <li><Link to="/comparar">Comparar papers</Link></li>
        </ul>
      </div>

      {/* Cuenta */}
      <div className="footer-col">
        <h4 className="footer-col-title">Tu cuenta</h4>
        <ul className="footer-links">
          <li><Link to="/registro">Crear cuenta</Link></li>
          <li><Link to="/login">Iniciar sesión</Link></li>
          <li><Link to="/favoritos">Mis favoritos</Link></li>
          <li><Link to="/historial">Historial</Link></li>
          <li><Link to="/estadisticas">Estadísticas</Link></li>
        </ul>
      </div>

      {/* Fuentes */}
      <div className="footer-col">
        <h4 className="footer-col-title">Fuentes de datos</h4>
        <ul className="footer-links">
          <li><a href="https://arxiv.org" target="_blank" rel="noreferrer">arXiv</a></li>
          <li><a href="https://www.crossref.org" target="_blank" rel="noreferrer">CrossRef</a></li>
        </ul>
        <div className="footer-contact">
          <span><MapPin size={13} /> Valencia, España</span>
          <span><Mail size={13} /> contact@scilens.app</span>
        </div>
      </div>

    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} SciLens · Todos los derechos reservados</p>
    </div>
  </footer>
);

export default Footer;

