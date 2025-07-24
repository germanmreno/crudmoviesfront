import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/main-page.css';
import '../styles/settings.css';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import Avatar from '../components/Avatar';
import MovieCard from '../components/MovieCard';
import MovieForm from '../components/MovieForm';
import MovieSearch from '../components/MovieSearch';
import Modal from '../components/Modal';
import SettingsPanel from '../components/settings/SettingsPanel';
import MovieGrid from '../components/MovieGrid';
import ConfirmDialog from '../components/ConfirmDialog';
import ReviewTabs from '../components/ReviewTabs';
import ExploreReviews from '../components/ExploreReviews';

export default function MainPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('my-reviews');

  useEffect(() => {
    loadUserReviews();
  }, [user?.preferences?.sortBy]); // Recargar cuando cambie el ordenamiento

  const loadUserReviews = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.getUserReviews(user?.preferences?.sortBy);
      const details = await Promise.all(
        data.data.movieIds.map(id => api.getMovieDetails(id))
      );

      // Combinar detalles de películas con reseñas
      const moviesWithReviews = details.map((movieDetail, index) => ({
        data: {
          id: data.data.reviews[index].movieId,
          title: movieDetail.data.title,
          year: movieDetail.data.year || movieDetail.data.release_date?.split('-')[0],
          poster: movieDetail.data.poster,
          overview: movieDetail.data.overview,
        },
        rating: data.data.reviews[index].rating,
        review: data.data.reviews[index].comment,
        createdAt: data.data.reviews[index].createdAt,
        reviewId: data.data.reviews[index]._id // Añadimos el ID único de la reseña
      }));

      setMovies(moviesWithReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
      // Mostrar mensaje de error
      const message = error.response?.data?.message || 'Error al cargar las reseñas';
      showNotification('error', message);
    } finally {
      setIsLoading(false);
    }
  };

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

    // Animación de entrada
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // Remover después de 3 segundos
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const handleAddMovie = () => {
    setSelectedMovie(null);
    setShowForm(true);
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie({
      id: movie.id,
      title: movie.title,
      year: movie.year,
      poster: movie.poster, // Usar el poster directamente
      overview: movie.overview,
      vote_average: movie.vote_average / 2, // Convertir a escala 1-5
    });
  };

  const handleSaveReview = async (reviewData) => {
    try {
      let response;
      // Verificar si es una actualización o una nueva reseña
      const existingMovie = movies.find(m => m.data.id === reviewData.movieId);

      if (existingMovie) {
        response = await api.updateReview(reviewData.movieId, reviewData);
      } else {
        response = await api.createReview(reviewData);
      }

      showNotification('success', response.data.message);
      await loadUserReviews();
      setShowForm(false);
    } catch (error) {
      const message = error.response?.data?.message || 'Error al guardar la reseña';
      showNotification('error', message);
      throw error;
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteClick = (movieId) => {
    setMovieToDelete(movieId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (movieToDelete) {
      try {
        const response = await api.deleteReview(movieToDelete);
        showNotification('success', response.data.message);
        await loadUserReviews();
      } catch (error) {
        const message = error.response?.data?.message || 'Error al eliminar la reseña';
        showNotification('error', message);
      }
      setMovieToDelete(null);
    }
  };

  return (
    <div className='movie-app'>
      <div className='stars-bg'></div>

      <header className='app-header'>
        <div className='profile-bar'>
          <div className='profile-info'>
            <Avatar
              name={user?.username || user?.name || user?.email}
              size={48}
              avatarUrl={user?.avatar}
            />
            <div className='profile-details'>
              <h3 className='profile-name'>{user?.username || user?.name || user?.email}</h3>
              <p className='profile-stats'>
                {movies.length} películas
              </p>
            </div>
          </div>

          <div className='profile-actions'>
            <button
              className='btn btn-secondary btn-small'
              onClick={() => setShowSettings(true)}
            >
              <span className='btn-icon'>⚙️</span>
              Configuración
            </button>
            <button className='btn btn-danger btn-small' onClick={handleLogoutClick}>
              <span className='btn-icon'>🚪</span>
              Salir
            </button>
          </div>
        </div>

        <div className='header-content'>
          <h1 className='app-title'>
            🎬 <span className='gradient-text'>CineReseñas</span>
          </h1>
          <p className='app-subtitle'>
            Tu colección personal de críticas cinematográficas
          </p>
        </div>

        <nav className="main-nav">
          <ReviewTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </nav>
      </header>

      <main className='main-content'>

        {activeTab === 'my-reviews' ? (
          <>
            <div className='action-bar'>
              <button className='btn btn-primary btn-add' onClick={handleAddMovie}>
                <span className='btn-icon'>✨</span>
                Agregar Película
              </button>

              <div className='stats'>
                <div className='stat-item'>
                  <span className='stat-number'>{movies.length}</span>
                  <span className='stat-label'>Películas</span>
                </div>
                <div className='stat-item'>
                  <span className='stat-number'>
                    {movies.length > 0
                      ? (
                        movies.reduce((acc, movie) => acc + movie.rating, 0) /
                        movies.length
                      ).toFixed(1)
                      : '0'}
                  </span>
                  <span className='stat-label'>Promedio</span>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="loader-container">
                <div className="loader-gradient"></div>
                <p className="loader-text">Cargando tus reseñas...</p>
              </div>
            ) : movies.length > 0 ? (
              <MovieGrid
                movies={movies}
                onEdit={(movie) => {
                  setSelectedMovie({
                    ...movie.data,
                    rating: movie.rating,
                    comment: movie.review,
                  });
                  setShowForm(true);
                }}
                onDelete={(movieId) => handleDeleteClick(movieId)}
              />
            ) : (
              <div className='empty-state'>
                <div className='empty-icon'>🎭</div>
                <h3>No hay películas aún</h3>
                <p>¡Comienza agregando tu primera reseña!</p>
              </div>
            )}
          </>
        ) : (
          <ExploreReviews />
        )}
      </main>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={selectedMovie ? 'Editar Reseña' : 'Nueva Reseña'}
      >
        {!selectedMovie ? (
          <MovieSearch onMovieSelect={handleMovieSelect} />
        ) : (
          <MovieForm
            selectedMovie={selectedMovie}
            onSubmit={handleSaveReview}
            onClose={() => setShowForm(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="⚙️ Configuración"
      >
        <SettingsPanel onClose={() => setShowSettings(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Cerrar Sesión"
        message="¿Estás seguro de que quieres cerrar sesión? Tendrás que volver a iniciar sesión para ver tus reseñas."
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        type="warning"
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setMovieToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Reseña"
        message="¿Estás seguro de que quieres eliminar esta reseña? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div >
  );
}
