import { Link } from 'react-router-dom';
import { useState } from 'react';
import QuickActions from '../components/QuickActions';
import TechnologyCard from '../components/TechnologyCard';
import TechnologyModal from '../components/TechnologyModal';
import TechnologySearch from '../components/TechnologySearch';
import RoadmapImporter from '../components/RoadmapImporter';
import useTechnologiesApi from '../hooks/useTechnologiesApi';

import './TechnologyList.css';

function TechnologyList() {
  const {
    technologies,
    addTechnology,
    importTechnologies,
    updateStatus,
    updateNotes,
    deleteTechnology,
    markAllAsCompleted,
    resetAllStatuses
  } = useTechnologiesApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const handleSearchSelect = (githubTech) => {
    const newTech = {
      title: githubTech.name,
      description: githubTech.description || 'GitHub репозиторий',
      category: getCategory(githubTech.language),
      status: 'not-started',
      notes: '',
      apiData: {
        stars: githubTech.stargazers_count,
        url: githubTech.html_url,
        language: githubTech.language,
        full_name: githubTech.full_name
      }
    };
    addTechnology(newTech);
    setShowSearch(false);
    alert(`Технология "${newTech.title}" добавлена!`);
  };
  const handleImportComplete = (importedTechs) => {
    importTechnologies(importedTechs);
    setShowImporter(false);
  };
  const handleTechClick = (tech) => {
    setSelectedTech(tech);
    setIsModalOpen(true);
  };
  const handleDelete = (techId) => {
    return deleteTechnology(techId);
  };
  const getCategory = (language) => {
    const map = {
      'JavaScript': 'Frontend',
      'TypeScript': 'Frontend',
      'Python': 'Backend',
      'Java': 'Backend',
      'Go': 'Backend',
      'Ruby': 'Backend',
      'PHP': 'Backend',
      'CSS': 'Styling',
      'HTML': 'Frontend'
    };
    return map[language] || 'Other';
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>📚 Все технологии</h1>
        <div className="header-actions">
          <Link to="/add-technology" className="btn btn-primary">
            + Добавить технологию
          </Link>
          
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="btn btn-info"
          >
            {showSearch ? 'Скрыть поиск' : 'Поиск на GitHub'}
          </button>
          
          <button
            onClick={() => setShowImporter(!showImporter)}
            className="btn btn-secondary"
          >
            {showImporter ? 'Скрыть импорт' : 'Импорт дорожной карты'}
          </button>
        </div>
      </div>
      {showSearch && (
        <div className="search-section">
          <TechnologySearch onSelect={handleSearchSelect} />
        </div>
      )}
      {showImporter && (
        <div className="importer-section">
          <RoadmapImporter onImport={handleImportComplete} />
        </div>
      )}
      <div className="quick-actions-container">
        <QuickActions 
          technologies={technologies}
          onMarkAllCompleted={markAllAsCompleted}
          onResetAll={resetAllStatuses}
        />
      </div>
      <div className="technology-list-main">
        <TechnologyCard 
          technologies={technologies}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          updateTechnologyNotes={updateNotes}
          onTechClick={handleTechClick}
        />
      </div>
      <TechnologyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTech(null);
        }}
        technology={selectedTech}
        onStatusChange={updateStatus}
        onNotesChange={updateNotes}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default TechnologyList;