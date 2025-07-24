// Importa la librería axios, que nos permite hacer peticiones HTTP de forma sencilla.
import axios from 'axios';

// Define la URL base de nuestra API del backend.
// Esto nos permite cambiar fácilmente la dirección del servidor en un solo lugar.
const API_URL = 'https://crudproyect-production.up.railway.app';

// Crea una instancia de axios con una configuración base.
const api = axios.create({
  baseURL: API_URL,
});

// Crea un interceptor que inyecta el token en cada una de las peticiones que se hacen al servidor.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// Auth endpoints
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const updateProfile = (data) => api.put('/auth/profile', data);
export const updateAvatar = (data) => api.put('/auth/avatar', data);
export const updatePreferences = (data) => api.put('/auth/preferences', data);

// Reviews endpoints
export const getUserReviews = (sortBy = 'recent') =>
  api.get('/reviews/user', { params: { sortBy } });
export const getReviews = (movieId) =>
  api.get('/reviews', { params: { movieId } });
export const createReview = (reviewData) => api.post('/reviews', reviewData);
export const updateReview = (movieId, reviewData) =>
  api.put(`/reviews/${movieId}`, reviewData);
export const deleteReview = (movieId) => api.delete(`/reviews/${movieId}`);

// Explore endpoints
export const exploreReviews = (params) =>
  api.get('/reviews/explore', { params });

export const toggleLike = (reviewId) => api.post(`/reviews/${reviewId}/like`);

export const checkHasLiked = (reviewId) =>
  api.get(`/reviews/${reviewId}/hasLiked`);

// Movies endpoints
export const searchMovies = (query) =>
  api.get('/movies/search', { params: { query } });
export const getMovieDetails = (movieId) => api.get(`/movies/${movieId}`);

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Busca películas registradas en la base de datos de reseñas para autocompletado
export const searchMoviesDB = (query) =>
  api.get('/reviews/search-movies', { params: { query } });

// Busca usuarios en el backend para autocompletado
export const searchUsers = (username) =>
  api.get('/auth/search-users', { params: { username } });

export default {
  login,
  register,
  updateProfile,
  updateAvatar,
  updatePreferences,
  getUserReviews,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  searchMovies,
  getMovieDetails,
  exploreReviews,
  toggleLike,
  checkHasLiked,
  searchMoviesDB, // <-- nuevo método para autocompletar películas de la base de datos
  searchUsers,
};
