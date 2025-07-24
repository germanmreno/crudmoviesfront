import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Cargar datos de sesión al iniciar
    const storedToken = localStorage.getItem('userToken');
    const storedUser = localStorage.getItem('userData');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
          setToken(storedToken);
          setUser(parsedUser);
        }
      } catch (error) {
        // Si hay un error al parsear, limpiar el localStorage
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const login = (newToken, userData) => {
    if (!newToken || !userData) {
      console.error('Invalid login data provided');
      return;
    }

    try {
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('userToken', newToken);
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  };

  // Función para actualizar solo los datos del usuario
  const updateUser = (userData) => {
    if (!userData) {
      console.error('Invalid user data provided');
      return;
    }

    try {
      setUser(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext; 