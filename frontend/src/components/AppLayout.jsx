import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BrandMark } from './BrandMark';
import { APP_COPY } from '../constants/copy';
import { APP_ROUTES } from '../constants/routes';
import { useAuth } from '../context/AuthContext';

export function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(APP_ROUTES.LOGIN, { replace: true });
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <BrandMark compact />
        <nav className="topbar__nav" aria-label="Navegación principal">
          <NavLink to={APP_ROUTES.HOME} end className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
            {APP_COPY.NAV_HOME}
          </NavLink>
          <NavLink to={APP_ROUTES.CATALOG} className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
            {APP_COPY.NAV_CATALOG}
          </NavLink>
        </nav>
        <button className="button button--quiet topbar__logout" onClick={handleLogout} type="button">
          {APP_COPY.LOGOUT}
        </button>
      </header>
      <main className="page-content">
        <Outlet />
      </main>
      <footer className="app-footer">{APP_COPY.FOOTER}</footer>
    </div>
  );
}
