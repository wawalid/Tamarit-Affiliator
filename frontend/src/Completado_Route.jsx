import { useAuth } from './context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function Completado_Route() {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return <h1>Loading...</h1>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user.completado !== true) {
    console.log("registro del usuario no completado");
    return (
      <Navigate
        to="/profile"
        replace
        state={{ message: "Por favor completa tu perfil antes de continuar." }}
      />
    );
  }

  return <Outlet />;
}

export default Completado_Route;
