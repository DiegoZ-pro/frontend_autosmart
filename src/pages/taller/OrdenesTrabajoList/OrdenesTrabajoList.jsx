// ============================================================================
// ÓRDENES DE TRABAJO - PLACEHOLDER
// ============================================================================

import { FileText } from 'lucide-react';
import styles from './OrdenesTrabajoList.module.css';

const OrdenesTrabajoList = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Órdenes de Trabajo</h1>
        <p className={styles.subtitle}>Gestiona todas las órdenes de trabajo del taller</p>
      </div>

      <div className={styles.placeholder}>
        <div className={styles.placeholderIcon}>
          <FileText size={64} strokeWidth={1.5} />
        </div>
        <h2>Próximamente</h2>
        <p>Esta sección estará disponible pronto</p>
      </div>
    </div>
  );
};

export default OrdenesTrabajoList;