import PropTypes from 'prop-types';
import StarRating from './StarRating';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const MovieCard = ({ movie, onEdit, onDelete, onLike, showUser, isExploreView }) => {
  //Formato de la fecha de creación de la reseña
  const formattedDate = movie.createdAt ?
    formatDistanceToNow(new Date(movie.createdAt), { addSuffix: true, locale: es }) :
    null;

  //Vista de la tarjeta de la película en la página de exploración

  return (
    <div className={`movie-card ${isExploreView ? 'explore' : ''}`}>
      <div className='movie-poster'>
        <img
          src={movie.data.poster || '/placeholder.svg'}
          alt={movie.data.title}
        />
        <div className='movie-overlay'>
          {!isExploreView && (
            <div className='movie-actions'>
              {onEdit && (
                <button
                  className='btn btn-secondary btn-icon-only'
                  onClick={() => onEdit(movie)}
                  title='Editar'
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button
                  className='btn btn-danger btn-icon-only'
                  onClick={() => onDelete(movie.data.id)}
                  title='Eliminar'
                >
                  🗑️
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className='movie-info'>
        {showUser && movie.user && (
          <div className="user-info">
            <img
              src={movie.user.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${movie.user.username}`}
              alt={movie.user.username}
              className="user-avatar"
            />
            <div>
              <div className="user-name">{movie.user.username}</div>
              {formattedDate && <div className="review-date">{formattedDate}</div>}
            </div>
          </div>
        )}

        <h3 className='movie-title'>{movie.data.title}</h3>
        <div className='movie-meta'>
          <span className='movie-year'>{movie.data.year}</span>
          <div className='movie-rating'>
            <StarRating
              initialRating={movie.rating}
              readOnly
              size={16}
            />
          </div>
        </div>
        <p className='movie-review'>{movie.review}</p>
      </div>

      {isExploreView && onLike && (
        <>
          <button
            className={`like-button ${movie.hasLiked ? 'liked' : ''}`}
            onClick={() => onLike(movie._id)}
            title={movie.hasLiked ? 'Quitar me gusta' : 'Me gusta'}
          >
            {movie.hasLiked ? '❤️' : '🤍'}
          </button>
          <div className="likes-count">
            {movie.likesCount} {movie.likesCount === 1 ? 'like' : 'likes'}
          </div>
        </>
      )}
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      year: PropTypes.string,
      poster: PropTypes.string,
    }).isRequired,
    rating: PropTypes.number.isRequired,
    review: PropTypes.string,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    }),
    createdAt: PropTypes.string,
    hasLiked: PropTypes.bool,
    likesCount: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onLike: PropTypes.func,
  showUser: PropTypes.bool,
  isExploreView: PropTypes.bool,
};

MovieCard.defaultProps = {
  showUser: false,
  isExploreView: false,
};

export default MovieCard; 