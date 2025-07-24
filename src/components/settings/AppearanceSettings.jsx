import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { THEMES } from '../../context/themeConstants';
import api from '../../api';

const AVATAR_STYLES = [
  { id: 'pixel-art', name: 'Pixel Art' },
  { id: 'bottts', name: 'Robots' },
  { id: 'adventurer', name: 'Aventurero' },
  { id: 'avataaars', name: 'Personajes' },
  { id: 'identicon', name: 'Abstracto' },
];

const AppearanceSettings = () => {
  const { currentTheme, changeTheme } = useTheme();
  const { user, updateUser } = useAuth();
  const [avatarStyle, setAvatarStyle] = useState('pixel-art');
  const [avatarSeed, setAvatarSeed] = useState(user?.username || 'default');
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

  const generateAvatarUrl = (style, seed) => {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
  };

  const handleAvatarStyleChange = (style) => {
    if (!isLoading) {
      setAvatarStyle(style);
    }
  };

  const handleAvatarGenerate = () => {
    if (!isLoading) {
      setAvatarSeed(Math.random().toString(36).substring(7));
    }
  };

  const handleSaveAvatar = async () => {
    setIsLoading(true);
    try {
      const avatarUrl = generateAvatarUrl(avatarStyle, avatarSeed);
      const { data } = await api.updateAvatar({ avatarUrl });
      updateUser(data.user);
      showNotification('success', '¡Avatar actualizado exitosamente!');
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar el avatar';
      showNotification('error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-section">
      <h3>Apariencia</h3>

      <div className="appearance-section">
        <h4>Avatar</h4>
        <div className="avatar-preview" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <img
            src={generateAvatarUrl(avatarStyle, avatarSeed)}
            alt="Avatar preview"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              marginBottom: '1rem',
              backgroundColor: 'var(--bg-darker)',
              padding: '0.5rem',
              opacity: isLoading ? 0.7 : 1,
              transition: 'opacity 0.3s ease'
            }}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleAvatarGenerate}
            style={{ display: 'block', margin: '1rem auto' }}
            disabled={isLoading}
          >
            🎲 Generar nuevo
          </button>
        </div>

        <div className="avatar-styles">
          <h5 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Estilo</h5>
          <div className="avatar-grid">
            {AVATAR_STYLES.map(style => (
              <div
                key={style.id}
                className={`avatar-option ${avatarStyle === style.id ? 'active' : ''}`}
                onClick={() => handleAvatarStyleChange(style.id)}
                title={style.name}
                style={{
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                <img
                  src={generateAvatarUrl(style.id, avatarSeed)}
                  alt={style.name}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
          onClick={handleSaveAvatar}
          disabled={isLoading}
          style={{ marginTop: '2rem', width: '100%' }}
        >
          {isLoading ? (
            <>
              <span className='btn-icon spinner'>🔄</span>
              Guardando...
            </>
          ) : (
            <>
              <span className='btn-icon'>💾</span>
              Guardar avatar
            </>
          )}
        </button>
      </div>

      <div className="appearance-section" style={{ marginTop: '3rem' }}>
        <h4>Tema de Color</h4>
        <div className="theme-grid">
          {Object.values(THEMES).map(theme => (
            <div
              key={theme.id}
              className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
              onClick={() => !isLoading && changeTheme(theme.id)}
              style={{
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              <div
                className="theme-preview"
                style={{
                  background: `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                }}
              />
              <p>{theme.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings; 