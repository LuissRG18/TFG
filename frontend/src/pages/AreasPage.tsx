import { Link } from 'react-router-dom';
import { AREAS_CIENTIFICAS } from '../types';

const AREA_META: Record<string, { code: string; desc: string; count: string }> = {
  cs:            { code: 'CS',   desc: 'Inteligencia artificial, algoritmos, redes y sistemas', count: '2.4M+' },
  medicine:      { code: 'MED',  desc: 'Clínica, farmacología, bioinformática y salud pública', count: '3.1M+' },
  physics:       { code: 'PHY',  desc: 'Física teórica, cuántica, materiales y partículas', count: '1.8M+' },
  biology:       { code: 'BIO',  desc: 'Genómica, ecología, biología celular y molecular', count: '2.0M+' },
  mathematics:   { code: 'MATH', desc: 'Álgebra, análisis, geometría y estadística', count: '900K+' },
  chemistry:     { code: 'CHEM', desc: 'Síntesis, catálisis, química computacional y materiales', count: '1.2M+' },
  economics:     { code: 'ECON', desc: 'Macroeconomía, finanzas, economía conductual y política', count: '700K+' },
  psychology:    { code: 'PSY',  desc: 'Cognición, comportamiento, neuropsicología y clínica', count: '850K+' },
  engineering:   { code: 'ENG',  desc: 'Ingeniería eléctrica, civil, mecánica y robótica', count: '1.5M+' },
  astronomy:     { code: 'ASTR', desc: 'Cosmología, exoplanetas, astrofísica y observación', count: '600K+' },
  environmental: { code: 'ENV',  desc: 'Cambio climático, sostenibilidad y ecología ambiental', count: '750K+' },
  neuroscience:  { code: 'NEURO',desc: 'Conectómica, neuroimagen, cognición y neurología', count: '950K+' },
};

const AreasPage = () => (
  <div className="areas-page">
    <div className="areas-page-header">
      <div className="areas-page-header-inner">
        <p className="section-eyebrow">EXPLORAR POR DISCIPLINA</p>
        <h1 className="areas-page-title">Áreas científicas</h1>
        <p className="areas-page-sub">
          Elige una disciplina y descubre los últimos avances de la investigación mundial.
        </p>
      </div>
    </div>

    <div className="areas-code-grid-wrapper">
      <div className="areas-code-grid">
        {AREAS_CIENTIFICAS.map((area) => {
          const meta = AREA_META[area.id] ?? { code: area.id.toUpperCase(), desc: '', count: '' };
          return (
            <Link key={area.id} to={`/areas/${area.id}`} className="area-code-item">
              <span className="area-code-badge">{meta.code}</span>
              <strong className="area-code-name">{area.label}</strong>
              <p className="area-code-desc">{meta.desc}</p>
              <span className="area-code-count">{meta.count} artículos</span>
              <span className="area-code-arrow">→</span>
            </Link>
          );
        })}
      </div>
    </div>
  </div>
);

export default AreasPage;

