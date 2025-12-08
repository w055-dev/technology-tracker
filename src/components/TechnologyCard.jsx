import './TechnologyCard.css';
import { useState } from 'react';
import TechnologyNotes from './TechnologyNotes';

function TechnologyCard({ technologies, searchQuery = '', setSearchQuery, updateTechnologyNotes, onTechClick }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedTechId, setExpandedTechId] = useState(null);
  
  const toggleNotes = (id, event) => {
    event.stopPropagation();
    setExpandedTechId(expandedTechId === id ? null : id);
  };
  
  const filteredTechnologies = technologies.filter(tech => {
    if (activeFilter !== 'all' && tech.status !== activeFilter){
      return false;
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="search-count">Найдено: {filteredTechnologies.length}</span>
      </div>
      
      <div className="filter-tabs">
        {['all', 'not-started', 'in-progress', 'completed'].map(filter => (
          <button
            key={filter}
            className={`btn btn-outline ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter === 'all' ? 'Все' : 
             filter === 'not-started' ? 'Не начатые' :
             filter === 'in-progress' ? 'В процессе' : 'Выполненные'}
          </button>
        ))}
      </div>
      
      <ul>
        {filteredTechnologies.map(tech => (
          <li
            key={tech.id}
            data-tech-id={tech.id}
            className={`tech-card ${tech.status} ${expandedTechId === tech.id ? 'expanded' : ''}`}
            onClick={() => onTechClick(tech)}
          >
            <div className="tech-info">
              <span className="tech-title">{tech.title}</span>
              <span className="tech-description">{tech.description}</span>
              
              <div className="tech-meta">
                <span className="tech-category">{tech.category}</span>
                <button 
                  className="notes-toggle-btn"
                  onClick={(e) => toggleNotes(tech.id, e)}
                  title={expandedTechId === tech.id ? "Скрыть заметки" : "Показать заметки"}
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
               tech.status === 'in-progress' ? '⏳' : '📋'}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TechnologyCard;