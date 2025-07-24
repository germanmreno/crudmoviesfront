import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';

const ProfileSettings = () => {
  const { user, login, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
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

  const validateForm = () => {
    const newErrors = {};

    if (formData.username.trim().length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Debes ingresar tu contraseña actual';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const payload = {
        username: formData.username,
        ...(formData.newPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      };

      const { data } = await api.updateProfile(payload);

      // Si hay cambio de contraseña, hacemos login completo
      if (formData.newPassword) {
        login(data.token, data.user);
        showNotification('success', '¡Perfil y contraseña actualizados exitosamente!');
      } else {
        // Si solo es cambio de username, actualizamos el usuario
        updateUser(data.user);
        showNotification('success', '¡Perfil actualizado exitosamente!');
      }

      // Limpiar campos de contraseña
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar el perfil';
      showNotification('error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="settings-section">
      <h3>Perfil</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nombre de usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? 'error' : ''}
            disabled={isLoading}
            style={{
              backgroundColor: 'var(--bg-darker)',
              color: 'var(--text-secondary)',
              opacity: isLoading ? 0.7 : 1
            }}
          />
          {errors.username && (
            <span className="error-message">{errors.username}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="currentPassword">Contraseña actual</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className={errors.currentPassword ? 'error' : ''}
            placeholder="Requerida para cambiar la contraseña"
            disabled={isLoading}
            style={{
              backgroundColor: 'var(--bg-darker)',
              color: 'var(--text-secondary)',
              opacity: isLoading ? 0.7 : 1
            }}
          />
          {errors.currentPassword && (
            <span className="error-message">{errors.currentPassword}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">Nueva contraseña</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className={errors.newPassword ? 'error' : ''}
            placeholder="Dejar en blanco para mantener la actual"
            disabled={isLoading}
            style={{
              backgroundColor: 'var(--bg-darker)',
              color: 'var(--text-secondary)',
              opacity: isLoading ? 0.7 : 1
            }}
          />
          {errors.newPassword && (
            <span className="error-message">{errors.newPassword}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'error' : ''}
            placeholder="Confirma tu nueva contraseña"
            disabled={isLoading}
            style={{
              backgroundColor: 'var(--bg-darker)',
              color: 'var(--text-secondary)',
              opacity: isLoading ? 0.7 : 1
            }}
          />
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>

        <button
          type="submit"
          className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
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
              Guardar cambios
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings; 