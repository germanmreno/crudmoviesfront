import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

//Hook para obtener el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
