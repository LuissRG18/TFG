import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import HomePage from './pages/HomePage';
import BuscarPage from './pages/BuscarPage';
import AreasPage from './pages/AreasPage';
import AreaDetallePage from './pages/AreaDetallePage';
import ArticuloPage from './pages/ArticuloPage';
import FavoritosPage from './pages/FavoritosPage';
import EstadisticasPage from './pages/EstadisticasPage';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import PerfilPage from './pages/PerfilPage';
import HistorialPage from './pages/HistorialPage';
import AdminPage from './pages/AdminPage';
import RecomendacionesPage from './pages/RecomendacionesPage';
import ComparadorPage from './pages/ComparadorPage';
import ArtemisPage from './pages/ArtemisPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="app-wrapper">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/buscar" element={<BuscarPage />} />
                <Route path="/areas" element={<AreasPage />} />
                <Route path="/areas/:areaId" element={<AreaDetallePage />} />
                <Route path="/articulo/:fuente/:id" element={<ArticuloPage />} />
                <Route path="/recomendados" element={<RecomendacionesPage />} />
                <Route path="/comparar" element={<ComparadorPage />} />
                <Route path="/artemis" element={<ArtemisPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registro" element={<RegistroPage />} />
                <Route
                  path="/favoritos"
                  element={<PrivateRoute><FavoritosPage /></PrivateRoute>}
                />
                <Route
                  path="/historial"
                  element={<PrivateRoute><HistorialPage /></PrivateRoute>}
                />
                <Route
                  path="/estadisticas"
                  element={<PrivateRoute><EstadisticasPage /></PrivateRoute>}
                />
                <Route
                  path="/perfil"
                  element={<PrivateRoute><PerfilPage /></PrivateRoute>}
                />
                <Route
                  path="/admin"
                  element={<PrivateRoute><AdminPage /></PrivateRoute>}
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

