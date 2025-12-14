import { useState } from 'react';

function RoadmapImporter({ onImport }) {
  const [importing, setImporting] = useState(false);
  const roadmaps = [
    {
      id: 'frontend',
      name: 'Frontend 2024',
      technologies: ['react', 'typescript', 'nextjs', 'tailwindcss']
    },
    {
      id: 'backend',
      name: 'Backend 2024',
      technologies: ['nodejs', 'express', 'mongodb', 'docker']
    }
  ];
  const fetchTechnology = async (techName) => {
    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${techName}&sort=stars&order=desc&per_page=1`,
        { headers: { 'Accept': 'application/vnd.github.v3+json' } }
      );
      if (!response.ok){
        return null;
      }
      const data = await response.json();
      if (!data.items || data.items.length === 0) {
        return null;
      }
      const repo = data.items[0];
      const [repoDetails, languages] = await Promise.all([
        fetch(`https://api.github.com/repos/${repo.full_name}`),
        fetch(`https://api.github.com/repos/${repo.full_name}/languages`)
      ]);
      const details = await repoDetails.json();
      const langs = await languages.json();
      return {
        title: techName.charAt(0).toUpperCase() + techName.slice(1),
        description: repo.description || techName,
        category: getCategory(repo.language),
        status: 'not-started',
        apiData: {
          stars: repo.stargazers_count,
          url: repo.html_url,
          language: repo.language
        },
        additionalResources: {
          repository: repo.html_url,
          documentation: `${repo.html_url}#readme`,
          issues: `${repo.html_url}/issues`,
          languages: langs,
          license: details.license?.name,
          homepage: details.homepage
        }
      };

    } catch (error) {
      console.error(`Ошибка загрузки ${techName}:`, error);
      return null;
    }
  };
  const getCategory = (language) => {
    const map = {
      'JavaScript': 'Frontend',
      'TypeScript': 'Frontend',
      'Python': 'Backend',
      'Java': 'Backend'
    };
    return map[language] || 'Other';
  };
  const handleImport = async (roadmap) => {
    try {
      setImporting(true);
      const imported = [];
      for (const techName of roadmap.technologies) {
        const tech = await fetchTechnology(techName);
        if (tech) {
          imported.push(tech);
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      if (imported.length > 0 && onImport) {
        onImport(imported);
        alert(`✅ Импортировано ${imported.length} технологий`);
      }

    } catch (error) {
      alert(`Ошибка импорта: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="roadmap-importer">
      <h3>Импорт дорожных карт</h3>
      <div className="roadmaps">
        {roadmaps.map(roadmap => (
          <div key={roadmap.id} className="roadmap-card">
            <h4>{roadmap.name}</h4>
            <div className="tech-tags">
              {roadmap.technologies.map(tech => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
            <button
              onClick={() => handleImport(roadmap)}
              disabled={importing}
              className="btn"
            >
              {importing ? 'Импорт...' : 'Импортировать'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoadmapImporter;