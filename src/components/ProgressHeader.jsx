import './ProgressHeader.css'
function ProgressHeader({ technologies }) {
  const totalTechs = technologies.length;
  const statusCounts = {
    completed: technologies.filter(tech => tech.status === 'completed').length,
    inProgress: technologies.filter(tech => tech.status === 'in-progress').length,
    notStarted: technologies.filter(tech => tech.status === 'not-started').length,
  };
  
  const progressPercentage = Math.round((statusCounts.completed / totalTechs) * 100)

  const getCategoryStats = () => {
    const categoryCount = {};
    technologies.forEach(tech => {
      if (tech.category) {
        categoryCount[tech.category] = (categoryCount[tech.category] || 0) + 1;
      }
    });
    
    if (Object.keys(categoryCount).length === 0){
      return null;
    }

    let maxCategory = '';
    let maxCount = 0;

    for (const [category, count] of Object.entries(categoryCount)) {
      if (count > maxCount) {
        maxCategory = category;
        maxCount = count;
      }
    }

    return {
      name: maxCategory,
      count: maxCount
    };
  };

  const mostPopularCategory = getCategoryStats();
  const getProgressMessage = (percentage) => {
    switch (true) {
      case percentage === 100:
        return { text: '🎉 Отлично!  Все технологии изучены! ', type: 'success' };
      case percentage >= 66:
        return { text: '👏 Хороший прогресс!  Еще немного... ', type: 'good' };
      case percentage >= 33:
        return { text: '📚 Продолжайте обучение! ', type: 'medium' };
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
          <span className="stat-value completed">{statusCounts.completed}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">В процессе</span>
          <span className="stat-value in-progress">{statusCounts.inProgress}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Не начинали</span>
          <span className="stat-value not-started">{statusCounts.notStarted}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Прогресс</span>
          <span className="stat-value">{progressPercentage}%</span>
        </div>
      </div>
      
      {mostPopularCategory && (
        <div className="category-info">
          <p className="category-label">
            Самая популярная категория: <strong>{mostPopularCategory.name}</strong> ({mostPopularCategory.count} шт.)
          </p>
        </div>
      )}
      
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