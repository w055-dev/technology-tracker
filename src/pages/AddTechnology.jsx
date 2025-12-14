import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import './AddTechnology.css';

function AddTechnology() {
  const navigate = useNavigate();
  const { technologies, setTechnologies } = useTechnologies();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Frontend',
    status: 'not-started',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const categories = [
    'Frontend',
    'Backend', 
    'Styling',
    'Tools',
    'Core Languages',
    'Testing',
    'Deployment',
    'Databases'
  ];
  const statusOptions = [
    { value: 'not-started', label: '❌ Не начато' },
    { value: 'in-progress', label: '⏳ В процессе' },
    { value: 'completed', label: '✅ Завершено' }
  ];
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Название обязательно';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Название должно быть короче 100 символов';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    } else if (formData.description.length > 150) {
      newErrors.description = 'Описание должно быть короче 150 символов';
    }
    if (!formData.category) {
      newErrors.category = 'Выберите категорию';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const newTechnology = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };
    const updatedTechnologies = [...technologies, newTechnology];
    if (typeof setTechnologies === 'function') {
      setTechnologies(updatedTechnologies);
    } else {
      localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));
    }
    alert(`Технология "${formData.title}" успешно добавлена!`);
    navigate('/technologies');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Добавить технологию</h1>
      </div>
      <div className="add-technology-container">
        <form className="technology-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">
               Название технологии *
              <span className="hint">(Например: React Hooks)</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Введите название технологии..."
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">
               Описание *
              <span className="hint">(Краткое описание технологии)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Опишите, что это за технология, зачем её изучать..."
              rows="4"
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
            <div className="char-counter">
              {formData.description.length}/150 символов
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">
                 Категория *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="status">
                 Статус изучения
              </label>
              <div className="status-buttons">
                {statusOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    className={`status-btn ${formData.status === value ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">
              📝 Заметки
              <span className="hint">(Необязательно. Можно добавить позже)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Добавьте заметки, ссылки на ресурсы или план изучения..."
              rows="3"
            />
            <div className="char-counter">
              {formData.notes.length}/1000 символов
            </div>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/technologies')}
            >
              ← Отмена
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setFormData({
                  title: '',
                  description: '',
                  category: 'Frontend',
                  status: 'not-started',
                  notes: ''
                });
                setErrors({});
              }}
            >
              Очистить форму
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Добавить технологию
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTechnology;