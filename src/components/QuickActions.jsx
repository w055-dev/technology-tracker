import './QuickActions.css';
import { useState } from 'react';
import { Link } from 'react-router-dom'
import DataImportExport from './DataImportExport';

function QuickActions({ technologies, onMarkAllCompleted, onResetAll, onUpdateDeadline, onImportData }) {
  const [showImportExport, setShowImportExport] = useState(false);
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
          onClick={() => {
            if (technologies.length === 0) {
              alert('Нет технологий для изменения статуса');
              return;
            }
            if (window.confirm(`Отметить все ${technologies.length} технологий как выполненные?`)) {
              onMarkAllCompleted();
            }
          }}
          title="Отметить все технологии как выполненные"
          disabled={technologies.length === 0}
          aria-disabled={technologies.length === 0}
        >
          Отметить все как выполненные
        </button>
        
        <button
          className="btn btn-warning"
          onClick={() => {
            if (technologies.length === 0) {
              alert('Нет технологий для изменения статуса');
              return;
            }
            if (window.confirm(`Сбросить статусы всех ${technologies.length} технологий?`)) {
              onResetAll();
            }
          }}
          title="Сбросить все статусы на 'не начато'"
          disabled={technologies.length === 0}
          aria-disabled={technologies.length === 0}
        >
          Сбросить все статусы
        </button>
        
        <button
          className="btn btn-info"
          onClick={selectRandomNextTechnology}
          title="Случайный выбор следующей технологии для изучения"
          disabled={technologies.length === 0}
          aria-disabled={technologies.length === 0}
        >
          Случайный выбор
        </button>

        <button
          className="btn btn-import-export"
          onClick={() => setShowImportExport(!showImportExport)}
          title="Импорт/экспорт данных"
        >
          {showImportExport ? 'Скрыть импорт/экспорт' : 'Импорт/экспорт'}
        </button>
        
        <Link
          to="/set-deadlines"
          className="btn btn-error"
          title="Установить дедлайны"
          disabled={technologies.length === 0}
          aria-disabled={technologies.length === 0}
        >
          Установить дедлайны
        </Link>
      </div>
      
      {showImportExport && (
        <div className="import-export">
          <DataImportExport onImport={onImportData} />
        </div>
      )}
    </div>
  );
}

export default QuickActions;