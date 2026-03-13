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
  '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16'
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
    <div className="loading-state">
      <Loader2 size={36} className="animate-spin text-indigo-500" />
    </div>
  );

  if (error || !stats) return (
    <div className="page-container">
      <div className="error-banner">{error || 'Error al cargar estadísticas.'}</div>
    </div>
  );

  // Gráfico: artículos por año (line)
  const aniosSorted = [...stats.porAnio].sort((a, b) => (a._id || 0) - (b._id || 0));
  const lineData = {
    labels: aniosSorted.map((a) => a._id?.toString() || 'N/A'),
    datasets: [{
      label: 'Artículos guardados',
      data: aniosSorted.map((a) => a.total),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.15)',
      fill: true,
      tension: 0.4,
    }],
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

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <BarChart2 size={28} className="text-indigo-500" />
          <h1 className="page-title">Mis Estadísticas</h1>
        </div>
        <p className="page-subtitle">Visualiza tus hábitos de lectura científica</p>
      </div>

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
            <Line data={lineData} options={chartOptions} />
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
  );
};

export default EstadisticasPage;

