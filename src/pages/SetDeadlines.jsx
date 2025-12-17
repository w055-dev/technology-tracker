import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTechnologiesApi from '../hooks/useTechnologiesApi';
import DeadlineManager from '../components/DeadlineManager';
import './SetDeadlines.css';

function SetDeadlines() {
  const navigate = useNavigate();
  const { technologies, updateDeadline } = useTechnologiesApi();

  const handleUpdateDeadline = (techId, newDeadline) => {
    updateDeadline(techId, newDeadline);
  };

  const handleBack = () => {
    navigate('/technologies');
  };

  if (technologies.length === 0) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Установка дедлайнов</h1>
        </div>
        <div className="empty-state">
          <p>Нет технологий для установки дедлайнов</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/add-technology')}
          >
            Добавить технологию
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={handleBack}
            style={{ marginLeft: '10px' }}
          >
            Назад к технологиям
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>📅 Установка сроков изучения</h1>
        <p>Установите дедлайны для выбранных технологий</p>
      </div>

      <div className="set-deadlines-container">
        <DeadlineManager 
          technologies={technologies}
          onUpdateDeadline={handleUpdateDeadline}
        />

        <div className="form-actions">
          <button 
            className="btn btn-secondary" 
            onClick={handleBack}
          >
            Назад к технологиям
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetDeadlines;