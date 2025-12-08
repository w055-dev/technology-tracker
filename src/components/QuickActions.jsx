import './QuickActions.css';
import { useState } from 'react';
import Modal from './Modal';

function QuickActions({ technologies, onMarkAllCompleted, onResetAll }) {
  const [showExportModal, setShowExportModal] = useState(false);
  
  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      totalTechnologies: technologies.length,
      technologies: technologies
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowExportModal(true);
  };

  const selectRandomNextTechnology = () => {
    const notCompletedTechs = technologies.filter(
      tech => tech.status !== 'completed'
    );

    if (notCompletedTechs.length === 0) {
      alert('Все технологии уже изучены!');
      return;
    }

    const randomIndex = Math.floor(Math.random() * notCompletedTechs.length);
    const randomTech = notCompletedTechs[randomIndex];

    const techElement = document.querySelector(`[data-tech-id="${randomTech.id}"]`);
    if (techElement) {
      techElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      alert(`Выбрана технология: "${randomTech.title}"`);
    }
  };

  return (
    <div className="quick-actions card">
      <h2>Быстрые действия</h2>
      <div className="actions-container">
        <button
          className="btn btn-success"
          onClick={onMarkAllCompleted}
          title="Отметить все технологии как выполненные"
        >
          Отметить все как выполненные
        </button>
        
        <button
          className="btn btn-warning"
          onClick={onResetAll}
          title="Сбросить все статусы на 'не начато'"
        >
          Сбросить все статусы
        </button>
        
        <button
          className="btn btn-info"
          onClick={selectRandomNextTechnology}
          title="Случайный выбор следующей технологии для изучения"
        >
          Случайный выбор
        </button>

        <button
          className="btn btn-purple"
          onClick={handleExport}
          title="Экспортировать данные в JSON-файл"
        >
          Экспорт данных
        </button>
      </div>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных"
      >
        <div className="export-modal-content">
          <p className="success-message">✅ Данные успешно экспортированы!</p>
          <p>Файл с вашими данными был загружен на ваш компьютер.</p>
          <p className="file-info">
            <strong>Формат файла:</strong> JSON<br />
            <strong>Содержит:</strong> {technologies.length} технологий
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowExportModal(false)}
          >
            Закрыть
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default QuickActions;