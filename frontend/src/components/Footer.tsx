import { FlaskConical, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="flex items-center gap-2" style={{ color: 'var(--accent)' }}>
        <FlaskConical size={18} />
        <span className="font-semibold text-white">SciLens</span>
      </div>
      <p className="text-sm text-gray-400">
        Explorador de artículos científicos · Datos de{' '}
        <a href="https://arxiv.org" target="_blank" rel="noreferrer" className="hover:text-indigo-400 underline">arXiv</a>,{' '}
        <a href="https://www.crossref.org" target="_blank" rel="noreferrer" className="hover:text-indigo-400 underline">CrossRef</a>
      </p>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <Link to="/buscar" className="hover:text-indigo-400">Explorar</Link>
        <Link to="/areas" className="hover:text-indigo-400">Áreas</Link>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400">
          <Github size={16} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;

