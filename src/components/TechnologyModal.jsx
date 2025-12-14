import './TechnologyModal.css';
import Modal from './Modal';
import ProgressBar from './ProgressBar';
import TechnologyNotes from './TechnologyNotes';
import { useState, useEffect } from 'react';

function TechnologyModal({ isOpen, onClose, technology, onStatusChange, onNotesChange, onDelete }) {
  const [localNotes, setLocalNotes] = useState('');
  useEffect(() => {
    if (technology) {
      setLocalNotes(technology.notes || '');
    }
  }, [technology]);
  if (!technology) {
    return null;
  }
  const getStatusClass = (status) => {
    const classes = {
      'completed': 'success',
      'in-progress': 'warning',
      'not-started': 'error'
    };
    return classes[status] || 'info';
  };
  const getStatusText = (status) => {
    const texts = {
      'completed': 'Завершено',
      'in-progress': 'В процессе',
      'not-started': 'Не начато'
    };
    return texts[status] || status;
  };
  const getStatusColor = (status) => {
    const colors = {
      'completed': 'var(--success-color)',
      'in-progress': 'var(--warning-color)',
      'not-started': 'var(--error-color)'
    };
    return colors[status] || 'var(--gray-dark)';
  };
  const handleStatusChange = (newStatus) => {
    onStatusChange(technology.id, newStatus);
  };
  const handleNotesChange = (techId, notes) => {
    setLocalNotes(notes);
    if (typeof onNotesChange === 'function') {
      onNotesChange(techId, notes);
    }
  };
  const handleDelete = () => {
    if (onDelete && onDelete(technology.id)) {
      onClose();
    }
  };
  const getTechProgress = () => {
    const progressMap = {
      'completed': 100,
      'in-progress': 50,
      'not-started': 0
    };
    return progressMap[technology.status] || 0;
  };
  const statusButtons = [
    { id: 'not-started', label: 'Не начато', color: 'var(--error-color)' },
    { id: 'in-progress', label: 'В процессе', color: 'var(--warning-color)' },
    { id: 'completed', label: 'Завершено', color: 'var(--success-color)' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={technology.title}>
      <div className="modal-tech-content">
        <div className="modal-tech-info">
          <div className="modal-tech-meta">
            <span className="modal-tech-category">{technology.category}</span>
            <div className="modal-tech-status">
              <span className={`status-badge ${getStatusClass(technology.status)}`}>
                {getStatusText(technology.status)}
              </span>
            </div>
          </div>
          <p className="modal-tech-description">{technology.description}</p>
          <div className="modal-status-selector">
            <h4>Изменить статус:</h4>
            <div className="modal-status-buttons">
              {statusButtons.map(({ id, label, color }) => (
                <button
                  key={id}
                  className={`btn ${technology.status === id ? 'modal-active' : ''}`}
                  onClick={() => handleStatusChange(id)}
                  style={{ backgroundColor: color }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="modal-notes-section">
            <TechnologyNotes
              techId={technology.id}
              notes={localNotes}
              onNotesChange={handleNotesChange}
            />
          </div>
          <div className="modal-progress-section">
            <ProgressBar
              progress={getTechProgress()}
              label="Прогресс по технологии"
              color={getStatusColor(technology.status)}
              height={10}
              showPercentage={true}
              animated={true}
            />
          </div>
          <div className="modal-actions">
            <button 
              className="btn btn-error"
              onClick={handleDelete}
              style={{ marginTop: '20px' }}
            >
               Удалить технологию
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default TechnologyModal;