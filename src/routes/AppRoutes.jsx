// ============================================================================
// APP ROUTES - Configuración de todas las rutas
// ============================================================================

import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Páginas públicas
import Home from '../pages/public/Home/Home';
import Login from '../pages/public/Login/Login';
import Register from '../pages/public/Register/Register';

// Páginas de cliente
import AgendarCita from '../pages/cliente/AgendarCita/AgendarCita';
import MiPerfil from '../pages/cliente/MiPerfil/MiPerfil';

// Layout para Admin/Mecánico
import MainLayout from '../components/layout/MainLayout/MainLayout';

// Páginas de Taller (Admin/Mecánico)
import OrdenesTrabajoList from '../pages/taller/OrdenesTrabajoList/OrdenesTrabajoList';
import MiPerfilTaller from '../pages/taller/MiPerfilTaller/MiPerfilTaller';
import RecepcionVehiculo from '../pages/taller/RecepcionVehiculo/RecepcionVehiculo';
import RecepcionLaboratorio from '../pages/taller/RecepcionLaboratorio/RecepcionLaboratorio';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ==================== RUTAS PÚBLICAS ==================== */}
      
      {/* Home - Redirige automáticamente si es admin/mecánico */}
      <Route path="/" element={<Home />} />

      {/* Login */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Register */}
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Agendar Cita - No requiere PublicRoute porque maneja auth internamente */}
      <Route path="/agendar-cita" element={<AgendarCita />} />

      {/* ==================== RUTAS PRIVADAS - TALLER ==================== */}
      
      {/* Rutas del Taller - Admin y Mecánico */}
      <Route
        path="/taller"
        element={
          <PrivateRoute allowedRoles={['admin', 'mecanico']}>
            <MainLayout />
          </PrivateRoute>
        }
      >
        {/* Recepción de Vehículo */}
        <Route path="recepcion-vehiculo" element={<RecepcionVehiculo />} />
        
        {/* Recepción de Laboratorio */}
        <Route path="recepcion-laboratorio" element={<RecepcionLaboratorio />} />
        
        {/* Órdenes de Trabajo */}
        <Route path="ordenes" element={<OrdenesTrabajoList />} />
        
        {/* Mi Perfil Taller */}
        <Route path="mi-perfil" element={<MiPerfilTaller />} />
        
        {/* Redirect /taller a /taller/recepcion-vehiculo */}
        <Route index element={<Navigate to="/taller/recepcion-vehiculo" replace />} />
      </Route>

      {/* ==================== RUTAS PRIVADAS - CLIENTE ==================== */}
      
      {/* Mi Perfil */}
      <Route
        path="/mi-perfil"
        element={
          <PrivateRoute>
            <MiPerfil />
          </PrivateRoute>
        }
      />

      {/* ==================== 404 - NOT FOUND ==================== */}
      <Route
        path="*"
        element={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h1 style={{ fontSize: '4rem', fontWeight: '700', color: '#0066CC' }}>404</h1>
            <p style={{ fontSize: '1.5rem', color: '#6B7280' }}>Página no encontrada</p>
            <a href="/" style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#0066CC', 
              color: 'white', 
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              marginTop: '1rem'
            }}>
              Volver al inicio
            </a>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;