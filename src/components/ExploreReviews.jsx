import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api';
import MovieCard from './MovieCard';

const ExploreReviews = () => {
  //Estados de la página de exploración de reseñas
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('movie');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);
  const [error, setError] = useState(null);
  //Estado para autocompletado de películas
  const [movieSuggestions, setMovieSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  //Estado para autocompletado de usuarios
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Referencia para el debounce cleanup
  const searchTimeout = useRef(null);

  // Función para obtener detalles de películas
  const fetchMovieDetails = async (movieId) => {
    try {
      const { data } = await api.getMovieDetails(movieId);
      return {
        title: data.title,
        year: data.year || data.release_date?.split('-')[0],
        poster: data.poster,
      };
    } catch (error) {
      console.error(`Error fetching movie details for ${movieId}:`, error);
      return null;
    }
  };

  // Función para cargar reseñas con debounce para la búsqueda
  const loadReviews = useCallback(async (searchParams) => {
    try {
      setError(null);
      setIsLoading(true);

      const { data } = await api.exploreReviews(searchParams);

      // Obtener detalles de películas para cada reseña
      const reviewsWithDetails = await Promise.all(
        data.data.reviews.map(async (review) => {
          const movieDetails = await fetchMovieDetails(review.movieId);
          return {
            ...review,
            movieTitle: movieDetails?.title || 'Película no encontrada',
            movieYear: movieDetails?.year || 'N/A',
            moviePoster: movieDetails?.poster || '/placeholder.svg',
          };
        })
      );

      if (searchParams.page === 1) {
        setReviews(reviewsWithDetails);
      } else {
        setReviews(prev => [...prev, ...reviewsWithDetails]);
      }

      setTotalReviews(data.data.total);
      setHasMore(data.data.currentPage < data.data.pages);
    } catch (error) {
      setError('Error al cargar las reseñas');
      console.error('Error loading reviews:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efecto para limpiar el timeout del debounce al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  // Efecto para autocompletar películas desde la base de datos
  useEffect(() => {
    if (searchType === 'movie' && searchTerm.length > 1) {
      const fetchSuggestions = async () => {
        try {
          const { data } = await api.searchMoviesDB(searchTerm);
          setMovieSuggestions(data.movies || []);
          setShowSuggestions(true);
        } catch {
          setMovieSuggestions([]);
          setShowSuggestions(false);
        }
      };
      fetchSuggestions();
    } else {
      setMovieSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, searchType]);

  // Efecto para autocompletar usuarios desde backend
  useEffect(() => {
    if (searchType === 'user' && searchTerm.length > 1) {
      const fetchUserSuggestions = async () => {
        try {
          const { data } = await api.searchUsers(searchTerm);
          setUserSuggestions(data.users || []);
          setShowSuggestions(true);
        } catch {
          setUserSuggestions([]);
          setShowSuggestions(false);
        }
      };
      fetchUserSuggestions();
    } else {
      setUserSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, searchType]);

  // Modificar el efecto de carga de reseñas para priorizar selectedMovie o selectedUser
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    if (searchType === 'movie' && selectedMovie) {
      // Buscar por movieId seleccionado
      searchTimeout.current = setTimeout(() => {
        loadReviews({ page, limit: 10, movieId: selectedMovie.movieId });
      }, 500);
    } else if (searchType === 'user' && selectedUser) {
      // Buscar por username seleccionado
      searchTimeout.current = setTimeout(() => {
        loadReviews({ page, limit: 10, username: selectedUser.username });
      }, 500);
    } else if (searchTerm || page === 1) {
      searchTimeout.current = setTimeout(() => {
        const searchParams = {
          page,
          limit: 10,
          ...(searchTerm && searchType === 'movie' && { movieId: searchTerm }),
          ...(searchTerm && searchType === 'user' && { username: searchTerm }),
        };
        loadReviews(searchParams);
      }, 500);
    }
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [page, searchTerm, searchType, loadReviews, selectedMovie, selectedUser]);

  // Manejador para seleccionar una película del autocompletado
  const handleSuggestionClick = (movie) => {
    setSelectedMovie(movie);
    setSelectedUser(null);
    setSearchTerm(movie.title);
    setShowSuggestions(false);
    setPage(1);
    // Lanzar búsqueda de reseñas por movieId
    loadReviews({ page: 1, limit: 10, movieId: movie.movieId });
  };

  // Manejador para seleccionar un usuario del autocompletado
  const handleUserSuggestionClick = (user) => {
    setSelectedUser(user);
    setSelectedMovie(null);
    setSearchTerm(user.username);
    setShowSuggestions(false);
    setPage(1);
    // Lanzar búsqueda de reseñas por username
    loadReviews({ page: 1, limit: 10, username: user.username });
  };

  // Al cambiar el tipo de búsqueda, limpiar selección de película y usuario
  const handleSearchTypeChange = (type) => {
    if (type !== searchType) {
      setSearchType(type);
      setSearchTerm('');
      setSelectedMovie(null);
      setSelectedUser(null);
      setPage(1);
      loadReviews({ page: 1, limit: 10 });
    }
  };

  // Al escribir en el input, limpiar selección de película y usuario
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedMovie(null);
    setSelectedUser(null);
    setPage(1);
  };

  // Manejador para cargar más reseñas
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  // Manejador para likes
  const handleLike = async (reviewId) => {
    try {
      const { data } = await api.toggleLike(reviewId);
      setReviews(prev => prev.map(review => {
        if (review._id === reviewId) {
          return {
            ...review,
            likesCount: data.data.likesCount,
            hasLiked: data.data.hasLiked
          };
        }
        return review;
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="explore-container">
      <div className="explore-header">
        <div className="search-controls">
          <div className="search-type-toggle">
            <button
              className={`toggle-btn ${searchType === 'movie' ? 'active' : ''}`}
              onClick={() => handleSearchTypeChange('movie')}
            >
              🎬 Películas
            </button>
            <button
              className={`toggle-btn ${searchType === 'user' ? 'active' : ''}`}
              onClick={() => handleSearchTypeChange('user')}
            >
              👤 Usuarios
            </button>
          </div>
          <div className="search-input-wrapper" style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder={searchType === 'movie' ? 'Buscar por película...' : 'Buscar por usuario...'}
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
              autoComplete="off"
              onFocus={() => setShowSuggestions(true)}
            />
            <span className="search-icon">🔍</span>
            {/* Dropdown de sugerencias de películas */}
            {searchType === 'movie' && showSuggestions && movieSuggestions.length > 0 && (
              <ul className="autocomplete-dropdown">
                {movieSuggestions.map((movie) => (
                  <li
                    key={movie.movieId}
                    className="autocomplete-item"
                    onClick={() => handleSuggestionClick(movie)}
                  >
                    <img src={movie.poster || '/placeholder.svg'} alt={movie.title} style={{ width: 32, height: 48, marginRight: 8 }} />
                    <span>{movie.title} {movie.year ? `(${movie.year})` : ''}</span>
                    {movie.reviewsCount > 1 && (
                      <span style={{ marginLeft: 'auto', fontSize: '0.95em', color: '#ffe066', opacity: 0.8 }}>
                        {movie.reviewsCount} reseñas
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {/* Dropdown de sugerencias de usuarios */}
            {searchType === 'user' && showSuggestions && userSuggestions.length > 0 && (
              <ul className="autocomplete-dropdown">
                {userSuggestions.map((user) => (
                  <li
                    key={user._id}
                    className="autocomplete-item"
                    onClick={() => handleUserSuggestionClick(user)}
                  >
                    <img src={user.avatar || '/placeholder.svg'} alt={user.username} style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }} />
                    <span>{user.username}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div className="reviews-grid">
        {reviews.map(review => (
          <MovieCard
            key={review._id}
            movie={{
              data: {
                id: review.movieId,
                title: review.movieTitle,
                year: review.movieYear,
                poster: review.moviePoster,
              },
              rating: review.rating,
              review: review.comment,
              user: review.user,
              likesCount: review.likesCount,
              hasLiked: review.hasLiked,
              createdAt: review.createdAt,
            }}
            showUser={true}
            onLike={() => handleLike(review._id)}
            isExploreView={true}
          />
        ))}
      </div>

      {isLoading && (
        <div className="loader-container">
          <div className="loader-gradient"></div>
          <p className="loader-text">Cargando reseñas...</p>
        </div>
      )}

      {!isLoading && reviews.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No se encontraron reseñas</h3>
          <p>
            {searchTerm
              ? 'Intenta con otros términos de búsqueda'
              : 'No hay reseñas disponibles en este momento'}
          </p>
        </div>
      )}

      {!isLoading && hasMore && reviews.length > 0 && (
        <button
          className="btn btn-secondary load-more-btn"
          onClick={handleLoadMore}
        >
          Cargar más reseñas
        </button>
      )}

      {!isLoading && reviews.length > 0 && (
        <div className="reviews-count">
          Mostrando {reviews.length} de {totalReviews} reseñas
        </div>
      )}
    </div>
  );
};

export default ExploreReviews; 