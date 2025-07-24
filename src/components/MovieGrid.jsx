import PropTypes from 'prop-types';
import MovieCard from './MovieCard';
import { useAuth } from '../hooks/useAuth';

const MovieGrid = ({ movies, onEdit, onDelete }) => {
  const { user } = useAuth();
  const gridSize = user?.preferences?.gridSize || 'medium';

  const gridStyles = {
    small: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '1rem',
    },
    medium: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '1.5rem',
    },
    large: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '2rem',
    },
  };

  return (
    <div
      className='movies-grid'
      style={{
        display: 'grid',
        ...gridStyles[gridSize],
        padding: '1rem',
      }}
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.reviewId} // Usamos el ID único de la reseña como key
          movie={movie}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

MovieGrid.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        year: PropTypes.string,
        poster: PropTypes.string,
      }).isRequired,
      rating: PropTypes.number.isRequired,
      review: PropTypes.string,
      reviewId: PropTypes.string.isRequired, // Añadimos la validación del reviewId
    })
  ).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default MovieGrid; 