import { Link, useLocation } from 'react-router-dom';

function Navigation({ isLoggedIn, username, onLogout }) {
  const location = useLocation();

  return (
    <nav className="main-navigation">
      <ul className="nav-menu">
        <li>
          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
          >
            Главная
          </Link>
        </li>
        <li>
          <Link
            to="/technologies"
            className={location.pathname === '/technologies' ? 'active' : ''}
          >
            Все технологии
          </Link>
        </li>
        <li>
          <Link
            to="/statistics"
            className={location.pathname === '/statistics' ? 'active' : ''}
          >
            Статистика
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            className={location.pathname === '/settings' ? 'active' : ''}
          >
            Настройки
          </Link>
        </li>
        {isLoggedIn ? (
          <>
            <li>
            <Link
              to="/admin"
              className={location.pathname === '/admin' ? 'active' : ''}
            >
              Админ
            </Link>
          </li>
            <li className="user-info">
              <button onClick={onLogout} className="logout-btn">
                Выйти
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link
              to="/login"
              className={location.pathname === '/login' ? 'active' : ''}
            >
              Войти
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;