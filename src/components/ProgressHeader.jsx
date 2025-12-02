import './ProgressHeader.css'
function ProgressHeader({ technologies }) {
  const totalTechs = technologies.length;
  const completedTechs = technologies.filter(tech => tech. status === 'completed').length;
  const progressPercentage = Math.round((completedTechs / totalTechs) * 100);

  const getProgressMessage = (percentage) => {
    switch (true) {
      case percentage === 100:
        return { text: '🎉 Отлично! Все технологии изучены!', type: 'success' };
      case percentage >= 66:
        return { text: '👏 Хороший прогресс!  Еще немного...', type: 'good' };
      case percentage >= 33:
        return { text: '📚 Продолжайте обучение!', type: 'medium' };
      default:
        return { text: '🚀 Рим не строился за один день!', type: 'start' };
    }
  };

  const message = getProgressMessage(progressPercentage);

  return (
    <div className="progress-header">
      <div className="progress-stats">
        <div className="stat-item">
          <span className="stat-label">Всего технологий</span>
          <span className="stat-value">{totalTechs}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Изучено</span>
          <span className="stat-value completed">{completedTechs}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Прогресс</span>
          <span className="stat-value">{progressPercentage}%</span>
        </div>
      </div>
      
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      <div className="progress-message">
        <p className={`message ${message.type}`}>{message.text}</p>
      </div>
    </div>
  );
}

export default ProgressHeader;