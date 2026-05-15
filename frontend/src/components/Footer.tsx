import { Github, Twitter, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">

      {/* Brand */}
      <div className="footer-brand">
        <div className="footer-logo">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="footer-logo-svg" aria-hidden="true">
            <circle cx="16" cy="16" r="16" fill="#1c3353"/>
            <line x1="1" y1="16" x2="5" y2="16" stroke="rgba(255,255,255,0.38)" strokeWidth="1" strokeDasharray="1.5 1.5"/>
            <line x1="27" y1="16" x2="31" y2="16" stroke="rgba(255,255,255,0.38)" strokeWidth="1" strokeDasharray="1.5 1.5"/>
            <path d="M5,16 Q16,7.5 27,16 Q16,24.5 5,16 Z" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round"/>
            <circle cx="16" cy="16" r="4.5" fill="#e67e22"/>
          </svg>
          <span className="footer-logo-text">
            <span className="footer-logo-sci">Sci</span><span className="footer-logo-lens">Lens</span>
          </span>
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
          <li><a href="https://openalex.org" target="_blank" rel="noreferrer">OpenAlex</a></li>
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

