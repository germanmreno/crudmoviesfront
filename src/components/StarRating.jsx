import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const StarRating = ({ initialRating = 0, onChange, readOnly = false, size = 24 }) => {
  const [rating, setRating] = useState(initialRating);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleClick = (newRating) => {
    if (readOnly) return;
    setRating(newRating);
    onChange?.(newRating);
  };

  const renderStar = (index) => {
    const starValue = index + 1;
    const filled = rating >= starValue;
    const halfFilled = rating === index + 0.5;

    let starIcon;
    if (filled) {
      starIcon = '★'; // Estrella llena
    } else if (halfFilled) {
      starIcon = '⯨'; // Estrella media
    } else {
      starIcon = '☆'; // Estrella vacía
    }

    return (
      <span
        key={index}
        onClick={() => handleClick(starValue)}
        style={{
          cursor: readOnly ? 'default' : 'pointer',
          fontSize: `${size}px`,
          color: (filled || halfFilled) ? '#ffd700' : '#ccc',
          WebkitTextStroke: '1px #ffd700',
          WebkitTextFillColor: (filled || halfFilled) ? '#ffd700' : 'transparent',
          padding: '0 2px',
        }}
      >
        {starIcon}
      </span>
    );
  };

  return (
    <div
      style={{ display: 'inline-flex', alignItems: 'center' }}
      role="group"
      aria-label="Star rating"
    >
      {[...Array(5)].map((_, index) => renderStar(index))}
      <span style={{ marginLeft: '8px', fontSize: `${size * 0.75}px` }}>
        {rating}/5
      </span>
    </div>
  );
};

StarRating.propTypes = {
  initialRating: PropTypes.number,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  size: PropTypes.number,
};

export default StarRating; 