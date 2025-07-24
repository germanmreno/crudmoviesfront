
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MovieReviewsPage from "./components/movie-reviews-page"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simular verificación de autenticación
    const checkAuth = () => {
      // En producción, aquí verificarías el token o sesión
      const userToken = localStorage.getItem("userToken")
      setIsAuthenticated(!!userToken)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = () => {
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#fff",
          fontSize: "1.5rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎬</div>
          <div>Cargando CineReseñas...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#fff",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div>
          <div style={{ fontSize: "4rem", marginBottom: "2rem" }}>🎬</div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#ffd700" }}>Bienvenido a CineReseñas</h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "2rem", color: "#b0b0b0" }}>
            Inicia sesión para acceder a tu colección de reseñas
          </p>
          <button
            onClick={handleLogin}
            style={{
              background: "linear-gradient(45deg, #ff6b6b 0%, #ffa500 100%)",
              border: "none",
              color: "white",
              padding: "1rem 2rem",
              borderRadius: "25px",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 8px 25px rgba(255, 107, 107, 0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.05)"
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(255, 107, 107, 0.4)"
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)"
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(255, 107, 107, 0.3)"
            }}
          >
            🚀 Iniciar Sesión
          </button>
        </div>
      </div>
    )
  }

  return <MovieReviewsPage />
}
