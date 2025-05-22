import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function WaitingVerificationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.is_verified) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
      <div className="bg-zinc-800 p-8 rounded-2xl shadow-xl text-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Cuenta en revisión</h1>
        <p className="mb-2">Tu cuenta aún no ha sido verificada por un administrador.</p>
        <p>Por favor, vuelve más tarde.</p>
      </div>
    </div>
  );
}

export default WaitingVerificationPage;
