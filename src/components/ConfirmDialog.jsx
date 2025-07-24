import PropTypes from 'prop-types';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = 'danger' }) => {
  if (!isOpen) return null;

  //Notificación para confirmar o cancelar una acción
  //isOpen: indica si la ventana está abierta o cerrada
  //onClose: función para cerrar la ventana
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content confirm-dialog"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '400px',
          textAlign: 'center',
          padding: '2rem'
        }}
      >
        <h3 style={{ marginBottom: '1rem' }}>
          {type === 'danger' ? '⚠️' : '❌'} {title}
        </h3>
        <p style={{
          marginBottom: '2rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.5'
        }}>
          {message}
        </p>
        <div className="button-group" style={{ justifyContent: 'center', gap: '1rem' }}>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            style={{ minWidth: '120px' }}
          >
            {cancelText || 'Cancelar'}
          </button>
          <button
            className={`btn btn-${type}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{ minWidth: '120px' }}
          >
            {confirmText || 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(['danger', 'warning', 'info'])
};

export default ConfirmDialog; 