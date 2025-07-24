import { useState } from 'react';
import PropTypes from 'prop-types';
import StarRating from './StarRating';

const MovieForm = ({ selectedMovie, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    rating: selectedMovie?.rating || 5,
    comment: selectedMovie?.comment || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rating || !formData.comment?.trim()) {
      return;
    }

    setIsSubmitting(true);
    await onSubmit({
      movieId: selectedMovie?.id?.toString(),
      rating: formData.rating,
      comment: formData.comment.trim(),
    });
    setIsSubmitting(false);
  };

  return (
    <div className="search-container">
      <form className='movie-form' onSubmit={handleSubmit}>
        {selectedMovie && (
          <div className='selected-movie-info'>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Película seleccionada
            </h4>
            <div className='result-item' style={{ marginBottom: '2rem' }}>
              <img
                src={selectedMovie.poster || '/placeholder.svg'}
                alt={selectedMovie.title}
                className="result-poster"
              />
              <div className='result-info'>
                <h5>{selectedMovie.title}</h5>
                <p className="result-year">{selectedMovie.year}</p>
                <p className="result-overview">
                  {selectedMovie.overview}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className='form-group'>
          <label htmlFor='rating'>Calificación</label>
          <StarRating
            initialRating={formData.rating}
            onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
            size={32}
            disabled={isSubmitting}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='comment'>Tu reseña</label>
          <textarea
            name='comment'
            id='comment'
            rows={4}
            placeholder={
              selectedMovie
                ? `¿Qué te pareció "${selectedMovie.title}"?`
                : 'Escribe tu opinión sobre la película...'
            }
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            className="search-input"
            style={{ minHeight: '120px', resize: 'vertical' }}
            disabled={isSubmitting}
          />
        </div>

        <div className='button-group' style={{ justifyContent: 'flex-end' }}>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type='submit'
            className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className='btn-icon spinner'>🔄</span>
                Guardando...
              </>
            ) : (
              <>
                <span className='btn-icon'>💾</span>
                Guardar reseña
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

MovieForm.propTypes = {
  selectedMovie: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    year: PropTypes.string,
    poster: PropTypes.string,
    overview: PropTypes.string,
    rating: PropTypes.number,
    comment: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MovieForm; 