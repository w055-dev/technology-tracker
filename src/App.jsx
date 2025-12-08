import { useState } from 'react';
import './App.css';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import TechnologyCard from './components/TechnologyCard';
import TechnologyModal from './components/TechnologyModal';
import useTechnologies from './hooks/useTechnologies';

function App() {
  const {
    technologies,
    updateStatus,
    updateNotes,
    markAllAsCompleted,
    resetAllStatuses
  } = useTechnologies();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="App">
      <header className="app-header">
        <h1>Трекер изучения технологий</h1>
      </header>
      
      <main className="app-main">
        <ProgressHeader technologies={technologies} />
        
        <QuickActions 
          technologies={technologies}
          onMarkAllCompleted={markAllAsCompleted}
          onResetAll={resetAllStatuses}
        />
        
        <TechnologyCard 
          technologies={technologies}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          updateTechnologyNotes={updateNotes}
          onTechClick={(tech) => {
            setSelectedTech(tech);
            setIsModalOpen(true);
          }}
        />
      </main>
      
      <TechnologyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTech(null);
        }}
        technology={selectedTech}
        onStatusChange={updateStatus}
        onNotesChange={updateNotes}
      />
      
      <footer className="app-footer">
        <p>📊 Всего технологий: {technologies.length}</p>
        <p className="footer-hint">💡 Данные сохраняются автоматически</p>
      </footer>
    </div>
  );
}

export default App;