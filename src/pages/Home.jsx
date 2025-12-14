import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>🚀 Добро пожаловать в Трекер технологий!</h1>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>Управление технологиями</h3>
          <p>Добавляйте, редактируйте и отслеживайте прогресс изучения технологий</p>
          <Link to="/technologies" className="btn btn-outline">
            Перейти к технологиям
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Статистика</h3>
          <p>Наглядная статистика вашего прогресса по категориям и статусам</p>
          <Link to="/statistics" className="btn btn-outline">
            Смотреть статистику
          </Link>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">⚙️</div>
          <h3>Настройки</h3>
          <p>Настройте тему оформления под свои предпочтения</p>
          <Link to="/settings" className="btn btn-outline">
            Перейти к настройкам
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;