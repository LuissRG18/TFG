import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const AnnouncementBar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [lang, setLang] = useState<'es' | 'en'>('es');

  return (
    <div className="announcement-bar">
      <div className="announcement-bar-inner">
        <span className="announcement-bar-status">
          <span className="announcement-dot" />
          Sincronizado con <strong>arXiv</strong> y <strong>CrossRef</strong>
          &nbsp;·&nbsp;última actualización hace 11 min
        </span>
        <div className="announcement-bar-actions">
          <button
            className={`ann-lang-btn${lang === 'en' ? ' active' : ''}`}
            onClick={() => setLang('en')}
          >EN</button>
          <span className="ann-sep">|</span>
          <button
            className={`ann-lang-btn${lang === 'es' ? ' active' : ''}`}
            onClick={() => setLang('es')}
          >ES</button>
          <span className="ann-sep">·</span>
          <button className="ann-mode-btn" onClick={toggleDarkMode}>
            {darkMode ? <><Sun size={12} /> Modo claro</> : <><Moon size={12} /> Modo oscuro</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
