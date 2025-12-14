import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

const initialTechnologies = [
  { id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'completed', category: 'Frontend', notes: '' },
  { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'in-progress', category: 'Frontend', notes: '' },
  { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'in-progress', category: 'Frontend', notes: '' },
  { id: 4, title: 'Promise API', description: 'Работа с промисами', status: 'completed', category: 'Core Languages', notes: '' },
  { id: 5, title: 'Responsive Design', description: 'Адаптивный дизайн', status: 'completed', category: 'Styling', notes: '' },
  { id: 6, title: 'Node.js Basics', description: 'Введение в Node.js', status: 'in-progress', category: 'Backend', notes: '' },
  { id: 7, title: 'MongoDB', description: 'Работа с базой данных', status: 'not-started', category: 'Backend', notes: '' },
  { id: 8, title: 'GitHub', description: 'Работа с GitHub', status: 'completed', category: 'Tools', notes: '' },
];

const useTechnologies = () => {
  const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);
  const updateStatus = (techId, newStatus) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  };
  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };
  const deleteTechnology = (techId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту технологию?')) {
      setTechnologies(prev => prev.filter(tech => tech.id !== techId));
      return true;
    }
    return false;
  };
  const addTechnology = (newTech) => {
    const techWithId = {
      ...newTech,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setTechnologies(prev => [...prev, techWithId]);
    return techWithId;
  };
  const markAllAsCompleted = () => {
    setTechnologies(prev =>
      prev.map(tech => ({
        ...tech,
        status: 'completed'
      }))
    );
  };
  const resetAllStatuses = () => {
    setTechnologies(prev =>
      prev.map(tech => ({
        ...tech,
        status: 'not-started'
      }))
    );
  };
  const calculateProgress = () => {
    if (technologies.length === 0){
      return 0;
    }
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  };

  return {
    technologies,
    setTechnologies,
    updateStatus,
    updateNotes,
    deleteTechnology,
    addTechnology,
    markAllAsCompleted,
    resetAllStatuses,
    calculateProgress
  };
};

export default useTechnologies;