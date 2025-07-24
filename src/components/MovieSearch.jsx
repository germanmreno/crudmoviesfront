import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../api';

const MovieSearch = ({ onMovieSelect }) => {
  //Estado para la búsqueda de películas
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  //Efecto para buscar películas en la base de datos de TMDB
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    //Debounce para evitar que se realicen múltiples búsquedas al mismo tiempo
    const debounceTimer = setTimeout(() => {
      const search = async () => {
        try {
          const { data } = await api.searchMovies(searchQuery);
          setSearchResults(data);
        } catch {
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      };
      search();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  //Vista de la búsqueda de películas
  return (
    <div className="search-container" style={{ padding: '1rem' }}>
      <div className="search-container-header">
        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '1rem', marginLeft: '1rem', marginRight: '1rem', padding: '1rem' }}>
          🔍 Buscar en Base de Datos de Películas de TMDB
        </h4>
      </div>

      <div className="search-input-group">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Busca una película (ej: Inception, Avengers...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isSearching && (
          <div className="search-loading" style={{ position: 'absolute', right: '1rem', top: '25%', transform: 'translateY(-50%)' }}>
            🔄
          </div>
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Resultados encontrados
          </h4>
          <div className="results-list">
            {searchResults.map((movie) => (
              <div
                key={movie.id}
                className="result-item"
                onClick={() => {
                  onMovieSelect(movie);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
              >
                <img
                  src={movie.poster || '/placeholder.svg'}
                  alt={movie.title}
                  className="result-poster"
                />
                <div className="result-info">
                  <h5>{movie.title}</h5>
                  <p className="result-year">{movie.year}</p>
                  <p className="result-rating">
                    ⭐ {movie.vote_average}/10
                  </p>
                  <p className="result-overview">
                    {movie.overview}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-small"
                  style={{ alignSelf: 'flex-start', minWidth: '120px' }}
                >
                  Seleccionar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchQuery && searchResults.length === 0 && !isSearching && (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
          No se encontraron resultados para "{searchQuery}"
        </div>
      )}
    </div>
  );
};

MovieSearch.propTypes = {
  onMovieSelect: PropTypes.func.isRequired,
};

export default MovieSearch; 