import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../../styles/login-page.css"
import api from "../../api";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "El nombre es requerido"
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirma tu contraseña"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { username: formData.name, email: formData.email, password: formData.password };

      const endpoint = isLogin ? api.login : api.register;
      const { data } = await endpoint(payload);

      // Usar el contexto de autenticación para iniciar sesión
      login(data.token, data.user);

      // Redirigir después de un pequeño delay para asegurar que el contexto se actualice
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (err) {
      const msg = err.response?.data?.msg || 'Error inesperado';
      setErrors({ general: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({ email: "", password: "", name: "", confirmPassword: "" })
    setErrors({})
  }

  return (
    <div className="login-app">
      <div className="stars-bg"></div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-section">
              <div className="logo-icon">🎬</div>
              <h1 className="logo-title">
                <span className="gradient-text">CineReseñas</span>
              </h1>
              <p className="logo-subtitle">{isLogin ? "¡Bienvenido de vuelta!" : "Únete a nuestra comunidad"}</p>
            </div>
          </div>

          <div className="form-container">
            <div className="form-tabs">
              <button
                className={`tab-button ${isLogin ? "active" : ""}`}
                onClick={() => setIsLogin(true)}
                type="button"
              >
                <span className="tab-icon">🔑</span>
                Iniciar Sesión
              </button>
              <button
                className={`tab-button ${!isLogin ? "active" : ""}`}
                onClick={() => setIsLogin(false)}
                type="button"
              >
                <span className="tab-icon">✨</span>
                Registrarse
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name">
                    <span className="label-icon">👤</span>
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Tu nombre completo"
                    className={errors.name ? "error" : ""}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">
                  <span className="label-icon">📧</span>
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <span className="label-icon">🔒</span>
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={errors.password ? "error" : ""}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <span className="label-icon">🔐</span>
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={errors.confirmPassword ? "error" : ""}
                  />
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
              )}

              {errors.general && (
                <div className="error-message general">{errors.general}</div>
              )}

              <button type="submit" className={`submit-btn ${isLoading ? "loading" : ""}`} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="loading-spinner">⚡</span>
                    {isLogin ? "Iniciando..." : "Registrando..."}
                  </>
                ) : (
                  <>
                    <span className="btn-icon">{isLogin ? "🚀" : "🎉"}</span>
                    {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                  </>
                )}
              </button>
            </form>

          </div>

          <div className="login-footer">
            <p>
              {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
              <button type="button" className="toggle-btn" onClick={toggleMode}>
                {isLogin ? "Regístrate aquí" : "Inicia sesión"}
              </button>
            </p>
          </div>
        </div>

        <div className="features-showcase">
          <h3>🌟 ¿Por qué CineReseñas?</h3>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🎭</span>
              <div>
                <h4>Reseñas Personalizadas</h4>
                <p>Crea y comparte tus críticas cinematográficas</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔍</span>
              <div>
                <h4>Búsqueda Avanzada</h4>
                <p>Encuentra películas desde nuestra base de datos</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <div>
                <h4>Estadísticas</h4>
                <p>Analiza tus gustos y tendencias cinematográficas</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌙</span>
              <div>
                <h4>Diseño Moderno</h4>
                <p>Interfaz oscura y elegante para una mejor experiencia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
