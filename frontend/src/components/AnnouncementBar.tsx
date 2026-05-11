import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const AnnouncementBar = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="announcement-bar">
      <div className="announcement-bar-inner">
        <span className="announcement-bar-status">
          <span className="announcement-dot" />
          Sincronizado con <strong>arXiv</strong> y <strong>CrossRef</strong>
          &nbsp;·&nbsp;última actualización hace 11 min
        </span>
        <div className="announcement-bar-actions">
          <button className="ann-mode-btn" onClick={toggleDarkMode}>
            {darkMode ? <><Sun size={12} /> Modo claro</> : <><Moon size={12} /> Modo oscuro</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
