import { Navigate, Outlet } from 'react-router-dom';
import { APP_ROUTES } from '../constants/routes';
import { useAuth } from '../context/AuthContext';

export function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to={APP_ROUTES.LOGIN} replace />;
}
