import { Link } from 'react-router-dom';
import { AREAS_CIENTIFICAS } from '../types';

const AreasPage = () => (
  <div className="page-container">
    <div className="page-header">
      <h1 className="page-title">Explorar por área científica</h1>
      <p className="page-subtitle">
        Elige una disciplina y descubre los últimos avances de la investigación mundial.
      </p>
    </div>

    <div className="areas-grid-full">
      {AREAS_CIENTIFICAS.map((area) => (
        <Link
          key={area.id}
          to={`/buscar?q=${encodeURIComponent(area.label)}&area=${area.id}`}
          className="area-card-full"
        >
          <span className="area-emoji-lg">{area.emoji}</span>
          <span className="area-label-lg">{area.label}</span>
          <span className="area-link-text">Explorar →</span>
        </Link>
      ))}
    </div>
  </div>
);

export default AreasPage;

