import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import TechnologyList from './pages/TechnologyList';
import AddTechnology from './pages/AddTechnology';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = localStorage.getItem('username') || '';
    setIsLoggedIn(loggedIn);
    setUsername(user);
  }, []);
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user);
  };
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <Router basename="/technology-tracker">
      <div className="App">
        <Navigation isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
        <main className='main-content'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/technologies" element={<TechnologyList />} />
            <Route path="/add-technology" element={<AddTechnology />} />
            <Route
              path="/login"
              element={<Login onLogin={handleLogin} />}
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>© 2025 Трекер технологий. Все права защищены.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;