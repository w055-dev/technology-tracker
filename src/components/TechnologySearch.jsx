import { useState, useEffect, useRef } from 'react';

function TechnologySearch({ onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Поиск технологий на GitHub
  const searchTechnologies = async (query) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=5`,
        { 
          signal: abortControllerRef.current.signal,
          headers: { 'Accept': 'application/vnd.github.v3+json' }
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Лимит запросов GitHub API. Попробуйте позже.');
        }
        throw new Error(`Ошибка: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.items || []);

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Debounce обработчик
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchTechnologies(value);
    }, 500);
  };

  // Очистка
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  return (
    <div className="technology-search">
      <h3>🔍 Поиск технологий</h3>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Поиск на GitHub..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {loading && <span>⌛</span>}
      </div>

      {error && <div className="error">⚠️ {error}</div>}

      <div className="results">
        {results.length > 0 ? (
          <div className="results-list">
            {results.map(tech => (
              <div key={tech.id} className="result-item">
                <div>
                  <strong>{tech.name}</strong>
                  <p>{tech.description}</p>
                  <div>
                    <span>⭐ {tech.stargazers_count}</span>
                    <span> {tech.language}</span>
                  </div>
                </div>
                <button
                  onClick={() => onSelect(tech)}
                  className="btn btn-sm"
                >
                  Добавить
                </button>
              </div>
            ))}
          </div>
        ) : searchTerm.trim() && !loading && (
          <p>Технологии не найдены</p>
        )}
      </div>
    </div>
  );
}

export default TechnologySearch;