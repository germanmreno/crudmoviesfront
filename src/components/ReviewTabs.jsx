import PropTypes from 'prop-types';

const ReviewTabs = ({ activeTab, onTabChange }) => {
  //Vista de las pestañas de reseñas
  return (
    <div className="review-tabs">
      <button
        className={`tab-button ${activeTab === 'my-reviews' ? 'active' : ''}`}
        onClick={() => onTabChange('my-reviews')}
      >
        <span className="tab-icon">📝</span>
        Mis Reseñas
      </button>
      <button
        className={`tab-button ${activeTab === 'explore' ? 'active' : ''}`}
        onClick={() => onTabChange('explore')}
      >
        <span className="tab-icon">🌎</span>
        Explorar
      </button>
    </div>
  );
};

ReviewTabs.propTypes = {
  activeTab: PropTypes.oneOf(['my-reviews', 'explore']).isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default ReviewTabs; 