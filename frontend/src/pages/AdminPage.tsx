import { useEffect, useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Shield, Users, BookMarked, Search, Loader2, UserCheck, UserX, Trash2 } from 'lucide-react';
import {
  obtenerUsuariosAdmin,
  cambiarEstadoUsuario,
  eliminarUsuarioAdmin,
  obtenerEstadisticasGlobales,
} from '../services/articulosService';
import type { Usuario, EstadisticasGlobales } from '../types';
import PageHead from '../components/PageHead';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const AdminPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [stats, setStats] = useState<EstadisticasGlobales | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'usuarios' | 'estadisticas'>('estadisticas');
  const [procesando, setProcesando] = useState<string | null>(null);
  const [busquedaAdmin, setBusquedaAdmin] = useState('');

  const cargar = async () => {
    setLoading(true);
    setError('');
    try {
      const [uRes, sRes] = await Promise.all([obtenerUsuariosAdmin(), obtenerEstadisticasGlobales()]);
      setUsuarios(uRes.usuarios);
      setStats(sRes.estadisticas);
    } catch {
      setError('Error al cargar datos de administración.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleToggleEstado = async (id: string) => {
    setProcesando(id);
    try {
      const res = await cambiarEstadoUsuario(id);
      setUsuarios((prev) => prev.map((u) => u.id === id || u._id === id
        ? { ...u, activo: res.usuario.activo }
        : u
      ));
    } catch {
      setError('No se pudo cambiar el estado del usuario.');
    } finally {
      setProcesando(null);
    }
  };

  const handleEliminar = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar al usuario "${nombre}" y todos sus datos? Esta acción es irreversible.`)) return;
    setProcesando(id);
    try {
      await eliminarUsuarioAdmin(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id && u._id !== id));
    } catch {
      setError('No se pudo eliminar el usuario.');
    } finally {
      setProcesando(null);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(busquedaAdmin.toLowerCase()) ||
    u.email.toLowerCase().includes(busquedaAdmin.toLowerCase())
  );

  if (loading) return (
    <div className="loading-state">
      <Loader2 size={36} className="animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div className="page-container" style={{ maxWidth: '1100px' }}>
      <PageHead titulo="Panel de administración" noIndex />
      <div className="page-header">
        <div className="flex items-center gap-3">
          <Shield size={28} className="text-rose-500" />
          <h1 className="page-title">Panel de Administración</h1>
        </div>
      </div>

      {error && <div className="error-banner mb-4">{error}</div>}

      {/* KPI cards */}
      {stats && (
        <div className="admin-kpi-grid">
          <div className="admin-kpi-card">
            <Users size={22} className="text-indigo-500" />
            <div>
              <div className="admin-kpi-value">{stats.totalUsuarios}</div>
              <div className="admin-kpi-label">Usuarios totales</div>
            </div>
          </div>
          <div className="admin-kpi-card">
            <UserCheck size={22} className="text-emerald-500" />
            <div>
              <div className="admin-kpi-value">{stats.totalActivos}</div>
              <div className="admin-kpi-label">Usuarios activos</div>
            </div>
          </div>
          <div className="admin-kpi-card">
            <BookMarked size={22} className="text-amber-500" />
            <div>
              <div className="admin-kpi-value">{stats.totalFavoritos}</div>
              <div className="admin-kpi-label">Favoritos guardados</div>
            </div>
          </div>
          <div className="admin-kpi-card">
            <Search size={22} className="text-sky-500" />
            <div>
              <div className="admin-kpi-value">{stats.totalBusquedas}</div>
              <div className="admin-kpi-label">Búsquedas realizadas</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="buscar-filters-bar mb-4">
        <button onClick={() => setTab('estadisticas')} className={`filter-btn ${tab === 'estadisticas' ? 'active' : ''}`}>
          Estadísticas globales
        </button>
        <button onClick={() => setTab('usuarios')} className={`filter-btn ${tab === 'usuarios' ? 'active' : ''}`}>
          Gestión de usuarios
        </button>
      </div>

      {/* Estadísticas globales */}
      {tab === 'estadisticas' && stats && (
        <div className="admin-charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Favoritos por fuente</h3>
            <Pie
              data={{
                labels: stats.favoritosPorFuente.map((f) => f._id),
                datasets: [{ data: stats.favoritosPorFuente.map((f) => f.total), backgroundColor: CHART_COLORS }],
              }}
              options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
            />
          </div>
          <div className="chart-card">
            <h3 className="chart-title">Búsquedas por fuente</h3>
            <Pie
              data={{
                labels: stats.busquedasPorFuente.map((f) => f._id || 'todas'),
                datasets: [{ data: stats.busquedasPorFuente.map((f) => f.total), backgroundColor: CHART_COLORS }],
              }}
              options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
            />
          </div>
          <div className="chart-card chart-card--wide">
            <h3 className="chart-title">Nuevos usuarios por mes</h3>
            <Bar
              data={{
                labels: stats.usuariosPorMes.map((m) => m._id),
                datasets: [{
                  label: 'Usuarios',
                  data: stats.usuariosPorMes.map((m) => m.total),
                  backgroundColor: '#6366f1',
                }],
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </div>
        </div>
      )}

      {/* Gestión de usuarios */}
      {tab === 'usuarios' && (
        <div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar usuario por nombre o email..."
              value={busquedaAdmin}
              onChange={(e) => setBusquedaAdmin(e.target.value)}
              className="form-input"
              style={{ maxWidth: '400px' }}
            />
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Registrado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((u) => {
                  const uid = u._id || u.id;
                  return (
                    <tr key={uid}>
                      <td className="font-semibold">{u.nombre}</td>
                      <td className="text-gray-500">{u.email}</td>
                      <td>
                        <span className={`badge ${u.rol === 'admin' ? 'badge-arxiv' : 'badge-default'}`}>
                          {u.rol}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.activo ? 'badge-crossref' : 'badge-default'}`}>
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="text-gray-500 text-xs">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('es-ES') : '—'}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleEstado(uid)}
                            disabled={procesando === uid}
                            className="btn-outline-sm"
                            title={u.activo ? 'Desactivar' : 'Activar'}
                          >
                            {u.activo ? <UserX size={13} /> : <UserCheck size={13} />}
                            {u.activo ? 'Desactivar' : 'Activar'}
                          </button>
                          <button
                            onClick={() => handleEliminar(uid, u.nombre)}
                            disabled={procesando === uid}
                            className="btn-danger-sm"
                            title="Eliminar usuario"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {usuariosFiltrados.length === 0 && (
              <div className="empty-state py-8">
                <p className="text-gray-400">No se encontraron usuarios.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
