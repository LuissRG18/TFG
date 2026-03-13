import { Link } from 'react-router-dom';
import { AREAS_CIENTIFICAS } from '../types';

import imgInformatica from '../assets/imgInformatica.jpg.jpg';
import imgMedicina from '../assets/imgMedicina.jpg.jpg';
import imgFisica from '../assets/imgFisica-jpg.png';
import imgBiologia from '../assets/imgBiologia.jpg.png';
import imgMatematicas from '../assets/imgMatematicas.jpg.png';
import imgQuimica from '../assets/imgQuimica.jpg.png';

const AREA_IMAGES: Record<string, string> = {
  cs: imgInformatica,
  medicine: imgMedicina,
  physics: imgFisica,
  biology: imgBiologia,
  mathematics: imgMatematicas,
  chemistry: imgQuimica,
};

const AreasPage = () => (
  <div className="page-container">
    <div className="page-header">
      <h1 className="page-title">Explorar por área científica</h1>
      <p className="page-subtitle">
        Elige una disciplina y descubre los últimos avances de la investigación mundial.
      </p>
    </div>

    <div className="areas-grid">
      {AREAS_CIENTIFICAS.map((area) => (
        <Link key={area.id} to={`/areas/${area.id}`} className="area-card">
          <div className="area-card-cover">
            {AREA_IMAGES[area.id]
              ? <img src={AREA_IMAGES[area.id]} alt={area.label} className="area-card-img" />
              : <div className="area-card-cover-fallback"><span className="area-emoji">{area.emoji}</span></div>
            }
          </div>
          <div className="area-card-body">
            <span className="area-label">{area.label}</span>
            <span className="area-explore">Explorar artículos →</span>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default AreasPage;

