import './TechnologyCard.css';

function TechnologyCard({ technologies }) {
  return (
    <div className="technology-list">
      <h2>Технологии</h2>
      <ul>
        {technologies.map(tech => (
          <li
            key={tech.id}
            className={tech.status === 'completed' ?  'completed' : tech.status === 'in-progress' ? 'in-progress' : 'not-started'}
          >
            <div className="tech-info">
              <span className="tech-title">{tech.title}</span>
              <span className="tech-description">{tech.description}</span>
            </div>
            {tech.status === 'completed' ?  '✅' : tech.status === 'in-progress' ? '⏳' : '📋'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TechnologyCard;