import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PublicRoute, ProtectedRoute, RoleRoute } from './routes/ProtectedRoute';

// Auth pages
import LoginPage          from './pages/auth/LoginPage';
import RegisterPage       from './pages/auth/RegisterPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';

// Admin pages
import AdminDashboard  from './pages/admin/AdminDashboard';
import AdminUsersPage  from './pages/admin/AdminUsersPage';
import AdminStoresPage from './pages/admin/AdminStoresPage';

// User pages
import UserDashboard   from './pages/user/UserDashboard';
import UserStoresPage  from './pages/user/UserStoresPage';

// Owner pages
import OwnerDashboard  from './pages/owner/OwnerDashboard';

// Root redirect based on role
function RootRedirect() {
  const { isAuthenticated, currentUser } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const home = { ADMIN: '/admin/dashboard', USER: '/user/dashboard', STORE_OWNER: '/owner/dashboard' };
  return <Navigate to={home[currentUser?.role] || '/login'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={3000}>
          <Routes>
            {/* Root */}
            <Route path="/" element={<RootRedirect />} />

            {/* Public */}
            <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<RoleRoute roles={['ADMIN']}><AdminDashboard /></RoleRoute>} />
            <Route path="/admin/users"     element={<RoleRoute roles={['ADMIN']}><AdminUsersPage /></RoleRoute>} />
            <Route path="/admin/stores"    element={<RoleRoute roles={['ADMIN']}><AdminStoresPage /></RoleRoute>} />

            {/* User */}
            <Route path="/user/dashboard" element={<RoleRoute roles={['USER']}><UserDashboard /></RoleRoute>} />
            <Route path="/user/stores"    element={<RoleRoute roles={['USER']}><UserStoresPage /></RoleRoute>} />

            {/* Store Owner */}
            <Route path="/owner/dashboard" element={<RoleRoute roles={['STORE_OWNER']}><OwnerDashboard /></RoleRoute>} />

            {/* Shared protected */}
            <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SnackbarProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
