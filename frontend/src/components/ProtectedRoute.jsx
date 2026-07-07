import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their dashboard
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'organizer') return <Navigate to="/organizer" replace />;
    return <Navigate to="/participant" replace />;
  }
  return children;
};

export default ProtectedRoute;
