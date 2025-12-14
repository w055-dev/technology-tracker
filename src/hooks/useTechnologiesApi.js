import { useState, useEffect } from 'react';

const useTechnologiesApi = () => {
  const [technologies, setTechnologies] = useState(() => {
    try {
      const saved = localStorage.getItem('technologies');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem('technologies', JSON.stringify(technologies));
  }, [technologies]);
  const addTechnology = (techData) => {
    const newTech = {
      id: Date.now(),
      ...techData,
      createdAt: new Date().toISOString()
    };
    setTechnologies(prev => [...prev, newTech]);
    return newTech;
  };
  const importTechnologies = (techsArray) => {
    const newTechs = techsArray.map(tech => ({
      id: Date.now() + Math.random(),
      ...tech,
      createdAt: new Date().toISOString()
    }));
    setTechnologies(prev => [...prev, ...newTechs]);
    return newTechs;
  };
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
    setTechnologies(prev => prev.filter(tech => tech.id !== techId));
    return true;
  };

  return {
    technologies,
    addTechnology,
    importTechnologies,
    updateStatus,
    updateNotes,
    deleteTechnology
  };
};

export default useTechnologiesApi;