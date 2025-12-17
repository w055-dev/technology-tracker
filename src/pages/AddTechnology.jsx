import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTechnologiesApi from '../hooks/useTechnologiesApi';
import './AddTechnology.css';

function AddTechnology() {
  const navigate = useNavigate();
  const { addTechnology } = useTechnologiesApi();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Frontend',
    status: 'not-started',
    notes: '',
    deadline: ''
  });
  const [errors, setErrors] = useState({});
  
  const categories = [
    'Frontend', 'Backend', 'Styling', 'Tools', 
    'Core Languages', 'Testing', 'Deployment', 'Databases'
  ];

  // Валидация в реальном времени
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Название обязательно';
        } else if (value.length < 3) {
          newErrors.title = 'Минимум 3 символа';
        } else {
          delete newErrors.title;
        }
        break;
        
      case 'description':
        if (!value.trim()) {
          newErrors.description = 'Описание обязательно';
        } else if (value.length < 10) {
          newErrors.description = 'Минимум 10 символов';
        } else {
          delete newErrors.description;
        }
        break;
        
      case 'deadline':
        if (!value.trim()) {
          newErrors.deadline = 'Дедлайн обязателен';
        } else {
          const deadlineDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (deadlineDate < today) {
            newErrors.deadline = 'Дедлайн не может быть в прошлом';
          } else {
            delete newErrors.deadline;
          }
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Название обязательно';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Минимум 3 символа';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Минимум 10 символов';
    }
    if (!formData.deadline) {
      newErrors.deadline = 'Дедлайн обязателен';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) {
        newErrors.deadline = 'Дедлайн не может быть в прошлом';
      }
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
      ...formData,
    };
    
    addTechnology(newTechnology);
    alert(`Технология "${formData.title}" успешно добавлена!`);
    navigate('/technologies');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Добавить технологию</h1>
      </div>
      <div className="add-technology-container">
        <form 
          className="technology-form" 
          onSubmit={handleSubmit}
          aria-label="Форма добавления новой технологии"
          noValidate
        >
          <div className="form-group">
            <label htmlFor="title">
              Название технологии *
              <span className="hint"> (минимум 3 символа)</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={() => validateField('title', formData.title)}
              placeholder="Введите название технологии..."
              className={errors.title ? 'error' : ''}
              aria-required="true"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && (
              <span id="title-error" className="error-message" role="alert">
                {errors.title}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">
              Описание *
              <span className="hint"> (минимум 10 символов)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={() => validateField('description', formData.description)}
              placeholder="Опишите, что это за технология, зачем её изучать..."
              rows="4"
              className={errors.description ? 'error' : ''}
              aria-required="true"
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "description-error" : undefined}
            />
            {errors.description && (
              <span id="description-error" className="error-message" role="alert">
                {errors.description}
              </span>
            )}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Категория *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                aria-required="true"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="status">Статус *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                aria-required="true"
              >
                <option value="not-started">❌ Не начато</option>
                <option value="in-progress">⏳ В процессе</option>
                <option value="completed">✅ Завершено</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="deadline">
              Дедлайн изучения *
              <span className="hint"> (обязательное поле)</span>
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              onBlur={() => validateField('deadline', formData.deadline)}
              min={new Date().toISOString().split('T')[0]}
              className={errors.deadline ? 'error' : ''}
              aria-required="true"
              aria-invalid={!!errors.deadline}
              aria-describedby={errors.deadline ? "deadline-error deadline-help" : "deadline-help"}
            />
            {errors.deadline && (
              <span id="deadline-error" className="error-message" role="alert">
                {errors.deadline}
              </span>
            )}
            <p id="deadline-help" className="help-text">
              Установите дату, к которой планируется изучить технологию
            </p>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Заметки</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Добавьте заметки или ссылки..."
              rows="3"
              aria-describedby="notes-help"
            />
            <p id="notes-help" className="help-text">
              Необязательное поле для дополнительной информации
            </p>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/technologies')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate('/technologies');
                }
              }}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              aria-disabled={Object.keys(errors).length > 0}
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