import { Link } from 'react-router-dom';
import { Cpu, Stethoscope, Atom, Dna, Calculator, FlaskConical, TrendingUp, Brain, Wrench, Telescope, Leaf, Activity } from 'lucide-react';
import PageHead from '../components/PageHead';
import { AREAS_CIENTIFICAS } from '../types';

const AREA_META: Record<string, { code: string; desc: string; count: string; accent: string; Icon: React.FC<{ size?: number }> }> = {
  cs:            { code: 'CS',   desc: 'Inteligencia artificial, algoritmos, redes y sistemas', count: '2.4M+', accent: '#3b82f6', Icon: Cpu },
  medicine:      { code: 'MED',  desc: 'Clínica, farmacología, bioinformática y salud pública', count: '3.1M+', accent: '#ef4444', Icon: Stethoscope },
  physics:       { code: 'PHY',  desc: 'Física teórica, cuántica, materiales y partículas', count: '1.8M+', accent: '#8b5cf6', Icon: Atom },
  biology:       { code: 'BIO',  desc: 'Genómica, ecología, biología celular y molecular', count: '2.0M+', accent: '#10b981', Icon: Dna },
  mathematics:   { code: 'MATH', desc: 'Álgebra, análisis, geometría y estadística', count: '900K+', accent: '#e67e22', Icon: Calculator },
  chemistry:     { code: 'CHEM', desc: 'Síntesis, catálisis, química computacional y materiales', count: '1.2M+', accent: '#f59e0b', Icon: FlaskConical },
  economics:     { code: 'ECON', desc: 'Macroeconomía, finanzas, economía conductual y política', count: '700K+', accent: '#0ea5e9', Icon: TrendingUp },
  psychology:    { code: 'PSY',  desc: 'Cognición, comportamiento, neuropsicología y clínica', count: '850K+', accent: '#ec4899', Icon: Brain },
  engineering:   { code: 'ENG',  desc: 'Ingeniería eléctrica, civil, mecánica y robótica', count: '1.5M+', accent: '#64748b', Icon: Wrench },
  astronomy:     { code: 'ASTR', desc: 'Cosmología, exoplanetas, astrofísica y observación', count: '600K+', accent: '#6366f1', Icon: Telescope },
  environmental: { code: 'ENV',  desc: 'Cambio climático, sostenibilidad y ecología ambiental', count: '750K+', accent: '#22c55e', Icon: Leaf },
  neuroscience:  { code: 'NEURO',desc: 'Conectómica, neuroimagen, cognición y neurología', count: '950K+', accent: '#f97316', Icon: Activity },
};

const AreasPage = () => (
  <div className="areas-page">
    <PageHead
      titulo="Áreas científicas"
      descripcion="Explora artículos científicos organizados por 12 disciplinas: informática, medicina, física, biología, matemáticas, química, economía, psicología, ingeniería, astronomía, medio ambiente y neurociencia."
    />
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
          const meta = AREA_META[area.id] ?? { code: area.id.toUpperCase(), desc: '', count: '', accent: '#e67e22', Icon: Atom };
          const { Icon } = meta;
          return (
            <Link
              key={area.id}
              to={`/areas/${area.id}`}
              className="area-code-item"
              style={{ '--area-accent': meta.accent } as React.CSSProperties}
            >
              <div className="area-code-icon-row">
                <span className="area-code-badge">{meta.code}</span>
                <span className="area-code-icon"><Icon size={18} /></span>
              </div>
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
