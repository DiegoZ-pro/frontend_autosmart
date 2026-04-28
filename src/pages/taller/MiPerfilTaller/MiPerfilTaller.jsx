// ============================================================================
// MI PERFIL TALLER - ADMIN/MECÁNICO
// Todos los tabs en un solo archivo
// ============================================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Key, FileText, Phone, Mail, Camera, Save,
  CheckCircle, Clock, AlertCircle, Eye, Search
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { ordenesService } from '../../../services/ordenesService';
import { authService } from '../../../services/authService';
import Alert from '../../../components/common/Alert/Alert';
import styles from './MiPerfilTaller.module.css';

const MiPerfilTaller = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resumen');
  
  // Estados para Datos Personales Tab
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [passwordAlert, setPasswordAlert] = useState({ show: false, type: '', message: '' });

  // Auto-hide alerts después de 5 segundos
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  useEffect(() => {
    if (passwordAlert.show) {
      const timer = setTimeout(() => {
        setPasswordAlert({ show: false, type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [passwordAlert.show]);

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: User },
    { id: 'datos-personales', label: 'Datos Personales', icon: User },
    { id: 'ordenes-asignadas', label: 'Órdenes Asignadas', icon: FileText }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'resumen':
        return <ResumenTab />;
      case 'datos-personales':
        return <DatosPersonalesTab />;
      case 'ordenes-asignadas':
        return <OrdenesAsignadasTab />;
      default:
        return <ResumenTab />;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Mi Perfil</h1>
          <p className={styles.subtitle}>
            Gestiona tu información personal y revisa tu actividad
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className={styles.content}>
        {renderTabContent()}
      </div>
    </div>
  );

  // ============================================================================
  // TAB 1: RESUMEN
  // ============================================================================
  function ResumenTab() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
      total_ordenes: 0,
      ordenes_en_proceso: 0,
      ordenes_completadas: 0,
      ordenes_pendientes: 0
    });

    useEffect(() => {
      fetchStats();
    }, []);

    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const filters = user.rol === 'mecanico' 
          ? { mecanico_id: user.id }
          : {};

        const response = await ordenesService.getAll(filters);
        
        if (response.success && response.data) {
          const ordenes = response.data;
          
          const total = ordenes.length;
          const enProceso = ordenes.filter(o => 
            ['en_proceso', 'diagnosticado', 'reparando', 'calibracion'].includes(o.estado_nombre?.toLowerCase())
          ).length;
          const completadas = ordenes.filter(o => 
            ['completado', 'entregado'].includes(o.estado_nombre?.toLowerCase())
          ).length;
          const pendientes = ordenes.filter(o => 
            o.estado_nombre?.toLowerCase() === 'pendiente'
          ).length;

          setStats({
            total_ordenes: total,
            ordenes_en_proceso: enProceso,
            ordenes_completadas: completadas,
            ordenes_pendientes: pendientes
          });
        }
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    const statCards = [
      {
        title: 'Total Órdenes',
        value: stats.total_ordenes,
        icon: FileText,
        color: '#0066CC',
        bgColor: '#EBF5FF'
      },
      {
        title: 'En Proceso',
        value: stats.ordenes_en_proceso,
        icon: Clock,
        color: '#F59E0B',
        bgColor: '#FEF3C7'
      },
      {
        title: 'Completadas',
        value: stats.ordenes_completadas,
        icon: CheckCircle,
        color: '#10B981',
        bgColor: '#D1FAE5'
      },
      {
        title: 'Pendientes',
        value: stats.ordenes_pendientes,
        icon: AlertCircle,
        color: '#EF4444',
        bgColor: '#FEE2E2'
      }
    ];

    if (loading) {
      return (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando estadísticas...</p>
        </div>
      );
    }

    return (
      <div className={styles.tabContainer}>
        <div className={styles.tabHeader}>
          <h2 className={styles.tabTitle}>
            {user.rol === 'mecanico' ? 'Mis Estadísticas' : 'Resumen General'}
          </h2>
          <p className={styles.tabSubtitle}>
            {user.rol === 'mecanico' 
              ? 'Vista general de tus órdenes de trabajo asignadas'
              : 'Vista general de las órdenes de trabajo del taller'
            }
          </p>
        </div>

        <div className={styles.statsGrid}>
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className={styles.statCard}>
                <div 
                  className={styles.iconContainer}
                  style={{ backgroundColor: card.bgColor }}
                >
                  <Icon 
                    size={24} 
                    style={{ color: card.color }}
                  />
                </div>
                <div className={styles.statContent}>
                  <p className={styles.statLabel}>{card.title}</p>
                  <p className={styles.statValue}>{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.infoCard}>
          <h3 className={styles.infoTitle}>Información de la Cuenta</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Nombre:</span>
              <span className={styles.infoValue}>{user.nombreCompleto || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email:</span>
              <span className={styles.infoValue}>{user.email || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Teléfono:</span>
              <span className={styles.infoValue}>{user.telefono || 'No registrado'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Rol:</span>
              <span className={styles.rolBadge}>
                {user.rol === 'admin' ? 'Administrador' : 'Mecánico'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // TAB 2: DATOS PERSONALES (incluye Cambiar Contraseña)
  // ============================================================================
  function DatosPersonalesTab() {
    const [formData, setFormData] = useState({
      nombreCompleto: user.nombreCompleto || '',
      telefono: user.telefono || '',
      email: user.email || ''
    });

    const [passwordData, setPasswordData] = useState({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setAlert({ show: false, type: '', message: '' });

      try {
        // Actualizar en el backend
        const response = await authService.updateProfile(user.id, {
          nombreCompleto: formData.nombreCompleto,
          telefono: formData.telefono
        });

        // Actualizar en el contexto local
        updateUser({
          ...user,
          nombreCompleto: formData.nombreCompleto,
          telefono: formData.telefono
        });

        // Mostrar alerta de éxito
        setAlert({
          show: true,
          type: 'success',
          message: 'Datos personales actualizados correctamente'
        });

      } catch (error) {
        console.error('❌ Error al actualizar perfil:', error);
        setAlert({
          show: true,
          type: 'error',
          message: error.response?.data?.message || error.message || 'Error al actualizar datos personales'
        });
      } finally {
        setLoading(false);
      }
    };

    const handlePasswordChange = (e) => {
      setPasswordData({
        ...passwordData,
        [e.target.name]: e.target.value
      });
    };

    const handlePasswordSubmit = async (e) => {
      e.preventDefault();
      setPasswordLoading(true);
      setPasswordAlert({ show: false, type: '', message: '' });

      if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setPasswordAlert({
          show: true,
          type: 'error',
          message: 'Todos los campos son requeridos'
        });
        setPasswordLoading(false);
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordAlert({
          show: true,
          type: 'error',
          message: 'Las contraseñas no coinciden'
        });
        setPasswordLoading(false);
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setPasswordAlert({
          show: true,
          type: 'error',
          message: 'La nueva contraseña debe tener al menos 6 caracteres'
        });
        setPasswordLoading(false);
        return;
      }

      try {
        const response = await authService.changePassword(
          passwordData.oldPassword,
          passwordData.newPassword
        );

        setPasswordAlert({
          show: true,
          type: 'success',
          message: 'Contraseña actualizada correctamente'
        });

        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

      } catch (error) {
        console.error('❌ Error al cambiar contraseña:', error);
        setPasswordAlert({
          show: true,
          type: 'error',
          message: error.response?.data?.message || error.message || 'Error al cambiar la contraseña'
        });
      } finally {
        setPasswordLoading(false);
      }
    };

    return (
      <div className={styles.tabContainer}>
        {/* DATOS PERSONALES */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <User size={20} />
            <h2 className={styles.sectionTitle}>Información Personal</h2>
          </div>

          {alert.show && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ show: false, type: '', message: '' })}
            />
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                {user.nombreCompleto ? user.nombreCompleto.charAt(0).toUpperCase() : 'U'}
              </div>
              <button type="button" className={styles.avatarBtn}>
                <Camera size={18} />
                Cambiar Foto
              </button>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <User size={16} />
                Nombre Completo*
              </label>
              <input
                type="text"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleChange}
                className={styles.input}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Phone size={16} />
                Teléfono*
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={styles.input}
                placeholder="Ej: 75123456"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Mail size={16} />
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                className={`${styles.input} ${styles.disabled}`}
                disabled
              />
              <p className={styles.hint}>El correo electrónico no se puede modificar</p>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className={styles.spinner}></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Guardar Cambios
                </>
              )}
            </button>
          </form>
        </div>

        {/* CAMBIAR CONTRASEÑA */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Key size={20} />
            <h2 className={styles.sectionTitle}>Cambiar Contraseña</h2>
          </div>

          {passwordAlert.show && (
            <Alert
              type={passwordAlert.type}
              message={passwordAlert.message}
              onClose={() => setPasswordAlert({ show: false, type: '', message: '' })}
            />
          )}

          <form onSubmit={handlePasswordSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Key size={16} />
                Contraseña Actual*
              </label>
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className={styles.input}
                placeholder="••••••••"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Key size={16} />
                Nueva Contraseña*
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className={styles.input}
                placeholder="••••••••"
                required
              />
              <p className={styles.hint}>Mínimo 6 caracteres</p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Key size={16} />
                Confirmar Nueva Contraseña*
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={styles.input}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={passwordLoading}
            >
              {passwordLoading ? (
                <>
                  <div className={styles.spinner}></div>
                  Cambiando...
                </>
              ) : (
                <>
                  <Key size={18} />
                  Cambiar Contraseña
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================================
  // TAB 3: ÓRDENES ASIGNADAS
  // ============================================================================
  function OrdenesAsignadasTab() {
    const [loading, setLoading] = useState(true);
    const [ordenes, setOrdenes] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
      fetchOrdenes();
    }, []);

    const fetchOrdenes = async () => {
      try {
        setLoading(true);
        
        const filters = user.rol === 'mecanico' 
          ? { mecanico_id: user.id }
          : {};

        const response = await ordenesService.getAll(filters);
        
        if (response.success && response.data) {
          setOrdenes(response.data);
        }
      } catch (error) {
        console.error('Error al obtener órdenes:', error);
      } finally {
        setLoading(false);
      }
    };

    const filteredOrdenes = ordenes.filter(orden => {
      const searchLower = search.toLowerCase();
      return (
        orden.numero_orden?.toLowerCase().includes(searchLower) ||
        orden.nombre_cliente?.toLowerCase().includes(searchLower) ||
        orden.placa_vehiculo?.toLowerCase().includes(searchLower)
      );
    });

    const getEstadoColor = (estado) => {
      const estadoMap = {
        'pendiente': '#F59E0B',
        'recepcionado': '#0066CC',
        'en_diagnostico': '#8B5CF6',
        'diagnosticado': '#06B6D4',
        'aprobado': '#10B981',
        'en_reparacion': '#F59E0B',
        'completado': '#10B981',
        'entregado': '#6B7280',
        'cancelado': '#EF4444'
      };
      return estadoMap[estado?.toLowerCase()] || '#6B7280';
    };

    const handleViewDetails = (ordenId) => {
      navigate(`/taller/ordenes/${ordenId}`);
    };

    if (loading) {
      return (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando órdenes...</p>
        </div>
      );
    }

    return (
      <div className={styles.tabContainer}>
        <div className={styles.tabHeader}>
          <div>
            <h2 className={styles.tabTitle}>
              {user.rol === 'mecanico' ? 'Mis Órdenes Asignadas' : 'Todas las Órdenes'}
            </h2>
            <p className={styles.tabSubtitle}>
              {user.rol === 'mecanico' 
                ? 'Órdenes de trabajo asignadas a ti'
                : 'Todas las órdenes de trabajo del taller'
              }
            </p>
          </div>
          <div className={styles.stats}>
            <span className={styles.totalBadge}>
              Total: {filteredOrdenes.length}
            </span>
          </div>
        </div>

        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por N° orden, cliente o placa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {filteredOrdenes.length === 0 ? (
          <div className={styles.empty}>
            <FileText size={48} />
            <p className={styles.emptyTitle}>No hay órdenes</p>
            <p className={styles.emptyText}>
              {search 
                ? 'No se encontraron órdenes con ese criterio de búsqueda'
                : user.rol === 'mecanico'
                  ? 'No tienes órdenes asignadas aún'
                  : 'No hay órdenes registradas en el sistema'
              }
            </p>
          </div>
        ) : (
          <div className={styles.ordenesGrid}>
            {filteredOrdenes.map((orden) => (
              <div key={orden.id} className={styles.ordenCard}>
                <div className={styles.ordenHeader}>
                  <div className={styles.ordenNumber}>
                    <FileText size={18} />
                    {orden.numero_orden}
                  </div>
                  <span 
                    className={styles.estadoBadge}
                    style={{ 
                      backgroundColor: `${getEstadoColor(orden.estado_nombre)}20`,
                      color: getEstadoColor(orden.estado_nombre)
                    }}
                  >
                    {orden.estado_nombre}
                  </span>
                </div>

                <div className={styles.ordenContent}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Cliente:</span>
                    <span className={styles.infoValue}>{orden.nombre_cliente}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Vehículo:</span>
                    <span className={styles.infoValue}>
                      {orden.marca_vehiculo} {orden.modelo_vehiculo} - {orden.placa_vehiculo}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Fecha:</span>
                    <span className={styles.infoValue}>
                      {new Date(orden.fecha_recepcion).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>

                <div className={styles.ordenFooter}>
                  <button
                    className={styles.viewBtn}
                    onClick={() => handleViewDetails(orden.id)}
                  >
                    <Eye size={16} />
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
};

export default MiPerfilTaller;