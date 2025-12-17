import './TechnologyCard.css';
import { useState } from 'react';
import TechnologyNotes from './TechnologyNotes';

function TechnologyCard({ technologies, searchQuery = '', setSearchQuery, updateTechnologyNotes, onTechClick, updateStatus }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedTechId, setExpandedTechId] = useState(null);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  
  const toggleNotes = (id, event) => {
    event.stopPropagation();
    setExpandedTechId(expandedTechId === id ? null : id);
  };
  const handleCardClick = (tech, event) => {
    if (event.target.closest('.notes-toggle-btn')) {
      return;
    }
    if (typeof onTechClick === 'function') {
      onTechClick(tech);
    }
    else if (typeof updateStatus === 'function') {
      const statusOrder = {
        'not-started': 'in-progress',
        'in-progress': 'completed',
        'completed': 'not-started'
      };
      const newStatus = statusOrder[tech.status] || 'not-started';
      updateStatus(tech.id, newStatus);
    }
  };
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      if (typeof setSearchQuery === 'function') {
        setSearchQuery(value);
      }
    }, 300);
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return '';
    const date = new Date(deadline);
    return date.toLocaleDateString('ru-RU');
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
    return 'normal';
  };
  
  const filteredTechnologies = technologies.filter(tech => {
    if (activeFilter !== 'all' && tech.status !== activeFilter){
      return false;
    }
    if (localSearchQuery.trim()) {
      const query = localSearchQuery.toLowerCase();
      return tech.title.toLowerCase().includes(query) ||
             tech.description.toLowerCase().includes(query) ||
             (tech.notes && tech.notes.toLowerCase().includes(query));
    }
    return true;
  });

  return (
    <div className="technology-list">
      <h2>Технологии</h2>
      <div className="search-box">
        <input
          type="text"
          placeholder="Поиск по названию, описанию или заметкам..."
          value={localSearchQuery}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
          aria-label="Поиск технологий"
        />
        <span className="search-count">Найдено: {filteredTechnologies.length}</span>
      </div>
      <div className="filter-tabs">
        {['all', 'not-started', 'in-progress', 'completed'].map(filter => (
          <button
            key={filter}
            className={`btn btn-outline ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
            aria-pressed={activeFilter === filter}
          >
            {filter === 'all' ? 'Все' : 
             filter === 'not-started' ? 'Не начатые' :
             filter === 'in-progress' ? 'В процессе' : 'Выполненные'}
          </button>
        ))}
      </div>
      {filteredTechnologies.length === 0 ? (
        <div className="empty-state">
          <p>Технологии не найдены. Попробуйте изменить поисковый запрос.</p>
        </div>
      ) : (
        <ul>
          {filteredTechnologies.map(tech => (
            <li
              key={tech.id}
              data-tech-id={tech.id}
              className={`tech-card ${tech.status} ${expandedTechId === tech.id ? 'expanded' : ''}`}
              onClick={(e) => handleCardClick(tech, e)}
              role="button"
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(tech, e);
                }
              }}
              aria-label={`Технология: ${tech.title}, статус: ${tech.status}`}
            >
              <div className="tech-info">
                <span className="tech-title">{tech.title}</span>
                <span className="tech-description">{tech.description}</span>
                
                <div className="tech-meta">
                  <div className="tech-meta-left">
                    <span className="tech-category">{tech.category}</span>
                    {tech.deadline && (
                      <span className={`deadline-badge ${getDeadlineStatus(tech.deadline)}`}>
                        📅 {formatDeadline(tech.deadline)}
                      </span>
                    )}
                  </div>
                  <button 
                    className="notes-toggle-btn"
                    onClick={(e) => toggleNotes(tech.id, e)}
                    title={expandedTechId === tech.id ? "Скрыть заметки" : "Показать заметки"}
                    aria-label={expandedTechId === tech.id ? "Скрыть заметки" : "Показать заметки для " + tech.title}
                  >
                    {tech.notes ? '📝' : '📄'}
                  </button>
                </div>
                {expandedTechId === tech.id && (
                  <TechnologyNotes 
                    techId={tech.id}
                    notes={tech.notes}
                    onNotesChange={updateTechnologyNotes}
                  />
                )}
              </div>
              <div className="status-icon">
                {tech.status === 'completed' ? '✅' : 
                 tech.status === 'in-progress' ? '⏳' : '❌'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TechnologyCard;