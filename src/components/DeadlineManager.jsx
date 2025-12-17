import { useState } from 'react';

function DeadlineManager({ technologies, onUpdateDeadline }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [newDeadline, setNewDeadline] = useState('');
  const [deadlineError, setDeadlineError] = useState('');

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

  return (
    <div className="deadline-manager" role="region" aria-label="Управление дедлайнами">
      <h3> Установка сроков изучения</h3>
      
      <div className="deadline-form">
        <div className="form-group">
          <label htmlFor="deadline-input">
            Выберите дату дедлайна *
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
            Установите дату, к которой должна быть изучена технология
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
                  <span className="tech-deadline">
                    {tech.deadline ? `(текущий: ${new Date(tech.deadline).toLocaleDateString('ru-RU')})` : '(нет дедлайна)'}
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
export default DeadlineManager