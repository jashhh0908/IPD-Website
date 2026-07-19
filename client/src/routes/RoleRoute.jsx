import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

export default function RoleRoute({ allowedRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={ROUTES.PUBLIC.LOGIN} replace />;
  }

  if (user.role !== allowedRole) {
    // Redirect to the correct homepage for their role
    const redirectPath = ROUTES[user.role]?.DASHBOARD || ROUTES.PUBLIC.LOGIN;
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
