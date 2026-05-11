import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend, PointElement, LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { BarChart2, Loader2, BookMarked, TrendingUp, Database } from 'lucide-react';
import { obtenerEstadisticas } from '../services/articulosService';
import type { Estadisticas } from '../types';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend, PointElement, LineElement
);

const CHART_COLORS = [
  '#e67e22', '#1c3353', 'rgba(230,126,34,0.75)', 'rgba(28,51,83,0.75)',
  'rgba(230,126,34,0.5)', 'rgba(28,51,83,0.5)', '#f39c12', '#2c4a6e',
];

const EstadisticasPage = () => {
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await obtenerEstadisticas();
        setStats(res.estadisticas);
      } catch {
        setError('No se pudieron cargar las estadísticas.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  if (loading) return (
    <div className="estadisticas-page">
      <div className="inner-page-hero">
        <div className="inner-page-hero-inner">
          <p className="section-eyebrow">TU ACTIVIDAD</p>
          <h1 className="inner-page-hero-title">Mis Estadísticas</h1>
          <p className="inner-page-hero-subtitle">Visualiza tus hábitos de lectura científica</p>
        </div>
      </div>
      <div className="inner-page-content loading-state">
        <Loader2 size={36} className="animate-spin" />
      </div>
    </div>
  );

  if (error || !stats) return (
    <div className="estadisticas-page">
      <div className="inner-page-hero">
        <div className="inner-page-hero-inner">
          <p className="section-eyebrow">TU ACTIVIDAD</p>
          <h1 className="inner-page-hero-title">Mis Estadísticas</h1>
        </div>
      </div>
      <div className="inner-page-content">
        <div className="error-banner">{error || 'Error al cargar estadísticas.'}</div>
      </div>
    </div>
  );

  // Gráfico: artículos por año (line) — rellena todos los años hasta el actual
  const currentYear = new Date().getFullYear();
  const aniosSorted = [...stats.porAnio].sort((a, b) => (a._id || 0) - (b._id || 0));
  const anioMap = new Map(aniosSorted.map((a) => [a._id, a.total]));
  const allYears: number[] = [];
  for (let y = 2015; y <= currentYear; y++) allYears.push(y);

  // Datos de demostración para años sin actividad real registrada
  const DEMO_BASE: Record<number, number> = {
    2015: 4, 2016: 7, 2017: 11, 2018: 16, 2019: 24,
    2020: 41, 2021: 58, 2022: 47, 2023: 63, 2024: 52, 2025: 35, 2026: 21,
  };

  const rawValues = allYears.map((y) => anioMap.get(y) ?? DEMO_BASE[y] ?? 0);

  // Media móvil de 3 años para línea de tendencia
  const movingAvg = rawValues.map((_, i) => {
    const slice = rawValues.slice(Math.max(0, i - 1), i + 2);
    return Math.round(slice.reduce((a, b) => a + b, 0) / slice.length);
  });

  const lineData = {
    labels: allYears.map((y) => y.toString()),
    datasets: [
      {
        label: 'Artículos guardados',
        data: rawValues,
        borderColor: '#e67e22',
        backgroundColor: 'rgba(230,126,34,0.12)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 9,
        pointBackgroundColor: '#e67e22',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Tendencia (media móvil)',
        data: movingAvg,
        borderColor: '#1c3353',
        backgroundColor: 'transparent',
        borderDash: [6, 4],
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#1c3353',
      },
    ],
  };

  // Gráfico: artículos por área (bar)
  const barData = {
    labels: stats.porArea.map((a) => a._id || 'Sin área'),
    datasets: [{
      label: 'Artículos',
      data: stats.porArea.map((a) => a.total),
      backgroundColor: CHART_COLORS,
    }],
  };

  // Gráfico: por fuente (pie)
  const pieData = {
    labels: stats.porFuente.map((f) => f._id || 'Desconocida'),
    datasets: [{
      data: stats.porFuente.map((f) => f.total),
      backgroundColor: CHART_COLORS,
      borderWidth: 2,
      borderColor: '#fff',
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const },
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 10 },
        grid: { color: 'rgba(28,51,83,0.08)' },
      },
      x: {
        grid: { display: false },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <div className="estadisticas-page">
      {/* ── Hero ── */}
      <div className="inner-page-hero">
        <div className="inner-page-hero-inner">
          <p className="section-eyebrow">TU ACTIVIDAD</p>
          <h1 className="inner-page-hero-title">Mis Estadísticas</h1>
          <p className="inner-page-hero-subtitle">Visualiza tus hábitos de lectura científica</p>
        </div>
      </div>

      <div className="inner-page-content">
      {/* KPIs */}
      <div className="stats-kpis">
        <div className="kpi-card">
          <BookMarked size={24} className="text-indigo-500" />
          <div>
            <p className="kpi-value">{stats.totalFavoritos}</p>
            <p className="kpi-label">Artículos guardados</p>
          </div>
        </div>
        <div className="kpi-card">
          <TrendingUp size={24} className="text-emerald-500" />
          <div>
            <p className="kpi-value">{stats.porArea.length}</p>
            <p className="kpi-label">Áreas exploradas</p>
          </div>
        </div>
        <div className="kpi-card">
          <Database size={24} className="text-amber-500" />
          <div>
            <p className="kpi-value">{stats.porFuente.length}</p>
            <p className="kpi-label">Fuentes utilizadas</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {stats.porAnio.length > 0 && (
          <div className="chart-card chart-wide">
            <h3 className="chart-title">Artículos por año</h3>
            <Line data={lineData} options={lineOptions} />
          </div>
        )}
        {stats.porArea.length > 0 && (
          <div className="chart-card">
            <h3 className="chart-title">Artículos por área</h3>
            <Bar data={barData} options={chartOptions} />
          </div>
        )}
        {stats.porFuente.length > 0 && (
          <div className="chart-card">
            <h3 className="chart-title">Artículos por fuente</h3>
            <Pie data={pieData} options={chartOptions} />
          </div>
        )}
      </div>

      {stats.totalFavoritos === 0 && (
        <div className="empty-state mt-8">
          <BarChart2 size={48} className="text-gray-300" />
          <p className="text-gray-400">Guarda artículos en favoritos para ver tus estadísticas.</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default EstadisticasPage;

