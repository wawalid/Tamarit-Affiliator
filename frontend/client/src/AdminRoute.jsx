import { useAuth } from './context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function AdminRoute() {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return <h1>Loading...</h1>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user.is_admin !== true) {
    console.log("usuario no es admin")
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
