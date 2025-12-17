import './TechnologyModal.css';
import Modal from './Modal';
import ProgressBar from './ProgressBar';
import TechnologyNotes from './TechnologyNotes';
import { useState, useEffect } from 'react';

function TechnologyModal({ 
  isOpen, 
  onClose, 
  technology, 
  onStatusChange, 
  onNotesChange, 
  onDelete, 
  onDeadlineChange 
}) {
  const [localNotes, setLocalNotes] = useState('');
  const [localDeadline, setLocalDeadline] = useState('');
  const [deadlineError, setDeadlineError] = useState('');

  useEffect(() => {
    if (technology) {
      setLocalNotes(technology.notes || '');
      setLocalDeadline(technology.deadline || '');
      setDeadlineError('');
    }
  }, [technology]);

  if (!technology) {
    return null;
  }
  const validateDeadline = (dateString) => {
    if (!dateString) {
      setDeadlineError('');
      return true;
    }
    
    const deadlineDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deadlineDate < today) {
      setDeadlineError('Дедлайн не может быть в прошлом');
      return false;
    }
    
    setDeadlineError('');
    return true;
  };
  const handleDeadlineChange = (e) => {
    const newDeadline = e.target.value;
    setLocalDeadline(newDeadline);
    validateDeadline(newDeadline);
  };

  const saveDeadline = () => {
    if (!validateDeadline(localDeadline)) {
      return;
    }
    
    if (typeof onDeadlineChange === 'function') {
      onDeadlineChange(technology.id, localDeadline);
    }
  };
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
  const formatDeadline = (deadline) => {
    if (!deadline) return 'Не установлен';
    const date = new Date(deadline);
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'over';
    }
    if (diffDays === 0){
      return 'today';
    }
    if (diffDays <= 3) {
      return 'soon';
    }
    return '';
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
          <div className="modal-deadline-section">
            <h4>Дедлайн изучения:</h4>
            <div className="deadline-info">
              <div className="current-deadline">
                <strong>Текущий:</strong> {formatDeadline(technology.deadline)}
                {technology.deadline && (
                  <span className={`deadline-status ${getDeadlineStatus(technology.deadline).toLowerCase()}`}>
                    {getDeadlineStatus(technology.deadline)}
                  </span>
                )}
              </div>
              
              <div className="deadline-edit">
                <label htmlFor="deadline-input">Изменить дедлайн:</label>
                <div className="deadline-input-group">
                  <input
                    type="date"
                    id="deadline-input"
                    value={localDeadline}
                    onChange={handleDeadlineChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={deadlineError ? 'error' : ''}
                    aria-describedby={deadlineError ? "deadline-error" : undefined}
                  />
                  <button
                    onClick={saveDeadline}
                    className="btn btn-sm"
                    disabled={!!deadlineError}
                    aria-disabled={!!deadlineError}
                  >
                    Сохранить
                  </button>
                </div>
                {deadlineError && (
                  <span id="deadline-error" className="error-message" role="alert">
                    {deadlineError}
                  </span>
                )}
                <p className="help-text">
                  Установите дату, к которой планируется изучить технологию
                </p>
              </div>
            </div>
          </div>
          
          <div className="modal-status-selector">
            <h4>Изменить статус:</h4>
            <div className="modal-status-buttons">
              {statusButtons.map(({ id, label, color }) => (
                <button
                  key={id}
                  className={`btn ${technology.status === id ? 'modal-active' : ''}`}
                  onClick={() => handleStatusChange(id)}
                  style={{ backgroundColor: color }}
                  aria-pressed={technology.status === id}
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
              aria-label={`Удалить технологию ${technology.title}`}
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