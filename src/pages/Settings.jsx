import { useState, useEffect } from 'react';
import './Settings.css';

function Settings() {
  const [theme, setTheme] = useState('light');

  // Загружаем тему из localStorage при монтировании
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  // Обработчик переключения темы
  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  // Функция сброса настроек
  const handleResetSettings = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все настройки к значениям по умолчанию?')) {
      localStorage.removeItem('theme');
      setTheme('light');
      document.body.setAttribute('data-theme', 'light');
      alert('Настройки сброшены!');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>⚙️Настройки</h1>
        <p>Настройте внешний вид приложения</p>
      </div>
      <div className="settings-container">
        <div className="setting-card">
          <div className="setting-header">
            <h3>🎨 Тема оформления</h3>
            <span className="setting-badge">Внешний вид</span>
          </div>
          <p className="setting-description">
            Выберите светлую или тёмную тему для комфортной работы. 
          </p>
          <div className="setting-control">
            <button 
              className={`theme-toggle ${theme === 'dark' ? 'active' : ''}`}
              onClick={handleThemeToggle}
              aria-label={`Переключить на ${theme === 'light' ? 'тёмную' : 'светлую'} тему`}
            >
              <span className="toggle-track">
                <span className="toggle-thumb">
                  {theme === 'light' ? '☀️' : '🌙'}
                </span>
              </span>
              <span className="toggle-label">
                {theme === 'light' ? 'Светлая тема' : 'Тёмная тема'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;