import { useState } from 'react';

function DeadlineManager({ technologies, onUpdateDeadline }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [newDeadline, setNewDeadline] = useState('');
  const [deadlineError, setDeadlineError] = useState('');

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 10);
    return maxDate.toISOString().split('T')[0];
  };

  const validateDeadline = (dateString) => {
    if (!dateString.trim()) {
      setDeadlineError('Дата обязательна');
      return false;
    }
    
    const deadlineDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deadlineDate < today) {
      setDeadlineError('Дедлайн не может быть в прошлом');
      return false;
    }
    
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 10);
    maxDate.setHours(23, 59, 59, 999);
    
    if (deadlineDate > maxDate) {
      setDeadlineError('Дедлайн не может быть более чем на 10 лет');
      return false;
    }
    
    setDeadlineError('');
    return true;
  };

  const handleApplyDeadline = () => {
    if (!validateDeadline(newDeadline)) return;
    
    selectedIds.forEach(id => {
      onUpdateDeadline(id, newDeadline);
    });
    
    setSelectedIds([]);
    setNewDeadline('');
  };

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return '';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0){
      return 'overdue';
    }
    if (diffDays === 0){
      return 'today';
    }
    if (diffDays <= 3){
      return 'soon';
    }
    return '';
  };

  return (
    <div className="deadline-manager" role="region" aria-label="Управление дедлайнами">
      <h3>Установка сроков изучения</h3>
      
      <div className="deadline-form">
        <div className="form-group">
          <label htmlFor="deadline-input">
            Выберите дату дедлайна
            <span className="required-asterisk" aria-hidden="true"> *</span>
          </label>
          <input
            type="date"
            id="deadline-input"
            value={newDeadline}
            onChange={(e) => {
              setNewDeadline(e.target.value);
              validateDeadline(e.target.value);
            }}
            min={new Date().toISOString().split('T')[0]}
            max={getMaxDate()}
            aria-required="true"
            aria-invalid={!!deadlineError}
            aria-describedby={deadlineError ? "deadline-error" : "deadline-help"}
            className={deadlineError ? 'error' : ''}
          />
          {deadlineError && (
            <span id="deadline-error" className="error-message" role="alert">
              {deadlineError}
            </span>
          )}
          <p id="deadline-help" className="help-text">
            Установите дату, к которой должна быть изучена технология (максимум 10 лет вперед)
          </p>
        </div>

        <div className="technologies-selection">
          <h4>Выберите технологии для обновления:</h4>
          <div className="tech-list">
            {technologies.map(tech => (
              <div key={tech.id} className="tech-item">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(tech.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds([...selectedIds, tech.id]);
                      } else {
                        setSelectedIds(selectedIds.filter(id => id !== tech.id));
                      }
                    }}
                    aria-label={`Выбрать ${tech.title} для установки дедлайна`}
                  />
                  <span className="tech-title">{tech.title}</span>
                  <span className={`deadline-indicator ${getDeadlineStatus(tech.deadline)}`}>
                    {tech.deadline ? `(${new Date(tech.deadline).toLocaleDateString('ru-RU')})` : ''}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleApplyDeadline}
          disabled={!newDeadline || selectedIds.length === 0 || !!deadlineError}
          aria-disabled={!newDeadline || selectedIds.length === 0 || !!deadlineError}
        >
          Установить дедлайн для {selectedIds.length} технологий
        </button>
      </div>
    </div>
  );
}

export default DeadlineManager;