import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_HOME = { ADMIN: '/admin/dashboard', USER: '/user/dashboard', STORE_OWNER: '/owner/dashboard' };

// Requires authentication — redirects to /login if not
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

// Requires a specific role — redirects to role home if mismatch
export function RoleRoute({ children, roles }) {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && !roles.includes(currentUser?.role)) {
    return <Navigate to={ROLE_HOME[currentUser?.role] || '/login'} replace />;
  }
  return children;
}

// Redirects authenticated users away from public pages (login/register)
export function PublicRoute({ children }) {
  const { isAuthenticated, currentUser } = useAuth();
  if (isAuthenticated) return <Navigate to={ROLE_HOME[currentUser?.role] || '/'} replace />;
  return children;
}
