import { useState } from 'react'
import './App.css'
import TechnologyCard from './components/TechnologyCard'
import ProgressHeader from './components/ProgressHeader'

function App() {
  const technologies = [
    { id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'completed' },
    { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'in-progress' },
    { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not-started' }
    ];
  return (
      <div className="App">
        <ProgressHeader technologies={technologies} />
        <TechnologyCard technologies={technologies} />
      </div>
  );
}

export default App
