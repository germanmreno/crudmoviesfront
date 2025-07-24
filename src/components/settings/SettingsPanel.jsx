import { useState } from 'react';
import PropTypes from 'prop-types';
import ProfileSettings from './ProfileSettings';
import AppearanceSettings from './AppearanceSettings';
import PreferencesSettings from './PreferencesSettings';

const SettingsPanel = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', icon: '👤', label: 'Perfil' },
    { id: 'appearance', icon: '🎨', label: 'Apariencia' },
    { id: 'preferences', icon: '⚙️', label: 'Preferencias' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'preferences':
        return <PreferencesSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-layout">
        <nav className="settings-nav">
          {sections.map(section => (
            <button
              key={section.id}
              className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="nav-icon">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>

        <div className="settings-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

SettingsPanel.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SettingsPanel; 