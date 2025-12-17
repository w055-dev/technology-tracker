import { useState } from 'react';
import './StatusEditor.css';

function StatusEditor({ technologies, onUpdateStatus }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [newStatus, setNewStatus] = useState('completed');
  const [isEditing, setIsEditing] = useState(false);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(technologies.map(tech => tech.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleTechSelect = (techId, checked) => {
    if (checked) {
      setSelectedIds(prev => [...prev, techId]);
    } else {
      setSelectedIds(prev => prev.filter(id => id !== techId));
    }
  };

  const handleApplyStatus = () => {
    if (selectedIds.length === 0) {
      alert('Выберите хотя бы одну технологию');
      return;
    }

    if (window.confirm(`Изменить статус ${selectedIds.length} технологий на "${newStatus}"?`)) {
      selectedIds.forEach(id => {
        onUpdateStatus(id, newStatus);
      });
      setSelectedIds([]);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e, techId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const isSelected = selectedIds.includes(techId);
      handleTechSelect(techId, !isSelected);
    }
  };

  const statusOptions = [
    { value: 'not-started', label: '❌ Не начато' },
    { value: 'in-progress', label: '⏳ В процессе' },
    { value: 'completed', label: '✅ Завершено' }
  ];

  return (
    <div className="status-editor" role="region" aria-label="Массовое редактирование статусов">
      <div className="editor-header">
        <h3>Массовое редактирование статусов</h3>
        <button
          className="btn btn-secondary"
          onClick={() => setIsEditing(!isEditing)}
          aria-expanded={isEditing}
          aria-controls="bulk-edit-content"
        >
          {isEditing ? 'Скрыть' : 'Редактировать'}
        </button>
      </div>

      {isEditing && (
        <div id="bulk-edit-content" className="editor-content">
          <div className="selection-controls">
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={selectedIds.length === technologies.length && technologies.length > 0}
                  onChange={handleSelectAll}
                  aria-label="Выбрать все технологии"
                />
                Выбрать все ({selectedIds.length} выбрано)
              </label>
            </div>

            <div className="technologies-list">
              {technologies.map(tech => (
                <div
                  key={tech.id}
                  className={`tech-item ${selectedIds.includes(tech.id) ? 'selected' : ''}`}
                  tabIndex="0"
                  onKeyDown={(e) => handleKeyDown(e, tech.id)}
                  role="checkbox"
                  aria-checked={selectedIds.includes(tech.id)}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(tech.id)}
                      onChange={(e) => handleTechSelect(tech.id, e.target.checked)}
                      aria-label={`Выбрать технологию ${tech.title}`}
                    />
                    <span className="tech-title">{tech.title}</span>
                    <span className={`status-badge ${tech.status}`}>
                      {tech.status === 'completed' ? '✅' : 
                       tech.status === 'in-progress' ? '⏳' : '❌'}
                    </span>
                  </label>
                </div>
              ))}
            </div>

            <div className="status-controls">
              <div className="form-group">
                <label htmlFor="bulk-status">Новый статус:</label>
                <select
                  id="bulk-status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  aria-describedby="status-help"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p id="status-help" className="help-text">
                  Будет применен ко всем выбранным технологиям
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleApplyStatus}
                disabled={selectedIds.length === 0}
                aria-disabled={selectedIds.length === 0}
              >
                Применить к {selectedIds.length} элементам
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusEditor;