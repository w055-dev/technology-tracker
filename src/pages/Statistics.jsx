import ProgressHeader from '../components/ProgressHeader';
import ProgressBar from '../components/ProgressBar';
import './Statistics.css';

function Statistics() {
  const technologies = JSON.parse(localStorage.getItem('technologies') || '[]');
  const calculateCategoryStats = () => {
    const categoryMap = {};
    technologies.forEach(tech => {
      if (tech.category) {
        categoryMap[tech.category] = (categoryMap[tech.category] || 0) + 1;
      }
    });
    
    return Object.entries(categoryMap).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / technologies.length) * 100)
    })).sort((a, b) => b.count - a.count);
  };
  const categoryStats = calculateCategoryStats();
  const getCategoryColor = (categoryName) => {
    const colors = {
      'Frontend': 'var(--success-color)',
      'Backend': 'var(--info-color)',
      'Styling': 'var(--purple-color)',
      'Tools': 'var(--warning-color)', 
      'Core Languages': 'var(--error-color)',
      'Testing': '#607D8B',
      'Deployment': '#795548',
      'Databases': '#9C27B0'
    };
    return colors[categoryName] || '#607D8B';
  };
  const statusCounts = {
    completed: technologies.filter(tech => tech.status === 'completed').length,
    inProgress: technologies.filter(tech => tech.status === 'in-progress').length,
    notStarted: technologies.filter(tech => tech.status === 'not-started').length,
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1> 📊Статистика изучения</h1>
      </div>
      <ProgressHeader technologies={technologies} />
      <div className="stats-container">
        <div className="stats-card">
          <h3>Распределение по категориям</h3>
          <div className="category-list">
            {categoryStats.map(category => (
              <div key={category.name} className="category-item">
                <div className="category-header">
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{category.count} тех. ({category.percentage}%)</span>
                </div>
                <ProgressBar 
                  progress={category.percentage}
                  color={getCategoryColor(category.name)}
                  height={8}
                  showPercentage={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;