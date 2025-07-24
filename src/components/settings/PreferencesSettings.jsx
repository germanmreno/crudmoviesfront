import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';

const GRID_SIZES = [
  { id: 'small', label: 'Compacto', icon: '▣▣▣' },
  { id: 'medium', label: 'Mediano', icon: '▣▣' },
  { id: 'large', label: 'Grande', icon: '▣' },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Más recientes primero' },
  { value: 'oldest', label: 'Más antiguas primero' },
  { value: 'rating-desc', label: 'Mayor calificación' },
  { value: 'rating-asc', label: 'Menor calificación' },
  { value: 'title-asc', label: 'Título (A-Z)' },
  { value: 'title-desc', label: 'Título (Z-A)' },
];

const PreferencesSettings = () => {
  const { user, updateUser } = useAuth();
  const [preferences, setPreferences] = useState({
    gridSize: user?.preferences?.gridSize || 'medium',
    sortBy: user?.preferences?.sortBy || 'recent',
  });
  const [isLoading, setIsLoading] = useState(false);

  const showNotification = (type, message) => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
        <span class="notification-message">${message}</span>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const handleSavePreferences = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.updatePreferences(preferences);
      updateUser(data.user);
      showNotification('success', '¡Preferencias actualizadas correctamente!');
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar preferencias';
      showNotification('error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-section">
      <h3>Preferencias</h3>

      <div className="preferences-section">
        <h4>Tamaño de Cuadrícula</h4>
        <div className="view-options">
          {GRID_SIZES.map(size => (
            <div
              key={size.id}
              className={`view-option ${preferences.gridSize === size.id ? 'active' : ''}`}
              onClick={() => !isLoading && setPreferences(prev => ({ ...prev, gridSize: size.id }))}
              style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
              <span className="view-icon" style={{ fontSize: '2rem' }}>
                {size.icon}
              </span>
              <p>{size.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="preferences-section" style={{ marginTop: '2rem' }}>
        <h4>Ordenar reseñas por</h4>
        <div className="form-group">
          <select
            value={preferences.sortBy}
            onChange={(e) => setPreferences(prev => ({ ...prev, sortBy: e.target.value }))}
            className="sort-select"
            disabled={isLoading}
            style={{ backgroundColor: 'var(--bg-darker)', color: 'var(--text-secondary)' }}
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
        onClick={handleSavePreferences}
        disabled={isLoading}
        style={{ marginTop: '2rem' }}
      >
        {isLoading ? (
          <>
            <span className='btn-icon spinner'>🔄</span>
            Guardando...
          </>
        ) : (
          <>
            <span className='btn-icon'>💾</span>
            Guardar preferencias
          </>
        )}
      </button>
    </div>
  );
};

export default PreferencesSettings; 