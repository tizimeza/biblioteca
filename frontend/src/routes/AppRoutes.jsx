import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { PrivateRoute } from '../components/PrivateRoute';
import { APP_ROUTES } from '../constants/routes';
import { CatalogPage } from '../pages/CatalogPage';
import { BookDetailPage } from '../pages/BookDetailPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path={APP_ROUTES.HOME} element={<HomePage />} />
          <Route path={APP_ROUTES.CATALOG} element={<CatalogPage />} />
          <Route path={APP_ROUTES.BOOK_DETAIL} element={<BookDetailPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={APP_ROUTES.HOME} replace />} />
    </Routes>
  );
}
