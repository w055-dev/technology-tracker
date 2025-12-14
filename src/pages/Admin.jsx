import { useState, useEffect } from 'react';
import './Admin.css';

function Admin() {
  const [systemInfo, setSystemInfo] = useState({
    version: '1.0.0',
    storageUsage: '0 KB',
    technologiesCount: 0,
    lastBackup: 'Никогда'
  });

  useEffect(() => {
    const techData = JSON.parse(localStorage.getItem('technologies') || '[]');
    const storageSize = JSON.stringify(localStorage).length;
    
    setSystemInfo({
      version: '1.0.0',
      storageUsage: `${(storageSize / 1024).toFixed(2)} KB`,
      technologiesCount: techData.length,
      lastBackup: localStorage.getItem('lastBackup') || 'Никогда',
    });
  }, []);

  const generateReport = () => {
    const report = {
      reportDate: new Date().toISOString(),
      systemInfo: {
        ...systemInfo,
        generatedAt: new Date().toLocaleString(),
        screenResolution: `${window.screen.width}x${window.screen.height}`
      },
      technologies: JSON.parse(localStorage.getItem('technologies') || '[]'),
      totalSize: JSON.stringify(localStorage).length
    };
    localStorage.setItem('lastBackup', new Date().toLocaleDateString());
    const dataStr = JSON.stringify(report, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tech-tracker-report-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('Отчет успешно сгенерирован и сохранен!');
    setSystemInfo(prev => ({
      ...prev,
      lastBackup: new Date().toLocaleDateString()
    }));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Админ-панель</h1>
        <p>Управление системой и отчеты</p>
      </div>
      <div className="admin-content">
        <div className="system-card">
          <h3>Информация о системе</h3>
          <div className="system-grid">
            <div className="system-item">
              <span className="system-label">Версия приложения:</span>
              <span className="system-value">{systemInfo.version}</span>
            </div>
            <div className="system-item">
              <span className="system-label">Технологий в базе:</span>
              <span className="system-value">{systemInfo.technologiesCount}</span>
            </div>
            <div className="system-item">
              <span className="system-label">Использование хранилища:</span>
              <span className="system-value">{systemInfo.storageUsage}</span>
            </div>
            <div className="system-item">
              <span className="system-label">Последний отчет:</span>
              <span className="system-value">{systemInfo.lastBackup}</span>
            </div>
          </div>
        </div>

        <div className="report-card">
          <h3>Генерация отчета</h3>
          <p className="report-description">
            Создать полный отчет со всеми технологиями и системной информацией в формате JSON.
          </p>
          <div className="report-actions">
            <button onClick={generateReport} className="btn btn-primary">
              📥 Создать отчет
            </button>
          </div>
        </div>

        <div className="status-card">
          <h3>✅ Статус системы</h3>
          <div className="status-items">
            <div className="status-item success">
              <span className="status-icon">✓</span>
              <span>Хранилище работает</span>
            </div>
            <div className="status-item success">
              <span className="status-icon">✓</span>
              <span>Доступ к localStorage</span>
            </div>
            <div className="status-item success">
              <span className="status-icon">✓</span>
              <span>Генерация отчетов доступна</span>
            </div>
            {systemInfo.lastBackup === 'Никогда' && (
              <div className="status-item warning">
                <span className="status-icon">⚠</span>
                <span>Рекомендуется создать первый отчет</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;