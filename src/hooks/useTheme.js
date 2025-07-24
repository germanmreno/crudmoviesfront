import { useContext } from 'react';
import { ThemeContext } from '../context/themeContext';

//Hook para obtener el contexto de tema
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a themeProvider');
  }
  return context;
}
