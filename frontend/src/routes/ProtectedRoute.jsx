import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protected route component — redirects to login if not authenticated,
 * or to home if user doesn't have the required role.
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.some((role) =>
      user.roles?.includes(`ROLE_${role}`)
    );
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
