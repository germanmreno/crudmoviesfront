import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { THEMES } from './themeConstants';
import { ThemeContext } from './themeContext';

export function ThemeProvider({ children }) {
  //Estado para el tema actual
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark-blue';
  });

  //Función para aplicar el tema
  const applyTheme = (themeId) => {
    const theme = THEMES[themeId];
    if (!theme) return;

    const root = document.documentElement;
    const { colors } = theme;

    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--bg-primary', colors.background);
    root.style.setProperty('--bg-secondary', colors.surface);
    root.style.setProperty('--bg-darker', colors.surface);
    root.style.setProperty('--text-primary', colors.text);
    root.style.setProperty('--text-secondary', colors.textSecondary);
    root.style.setProperty('--border-color', colors.border);

    // Convertir colores hex a RGB para usar con opacidad
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : null;
    };

    root.style.setProperty('--primary-rgb', hexToRgb(colors.primary));
    root.style.setProperty('--secondary-rgb', hexToRgb(colors.secondary));
  };

  //Función para cambiar el tema
  const changeTheme = (themeId) => {
    if (THEMES[themeId]) {
      setCurrentTheme(themeId);
      localStorage.setItem('theme', themeId);
      applyTheme(themeId);
    }
  };

  //Efecto para aplicar el tema
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
}; 