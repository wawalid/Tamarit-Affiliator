import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import { Link } from "react-router-dom"; // <--- Aquí

function AdminPage() {
  const { getUsers, users } = useAuth();

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-center text-2xl font-bold mb-8 text-white">Administrar usuarios</h1>
      <div className="overflow-x-auto">
        {users.length === 0 ? (
          <p className="text-white text-center">No users available</p>
        ) : (
          <table className="min-w-full bg-zinc-800 text-white rounded shadow-lg">
            <thead>
              <tr className="bg-zinc-700 text-left">
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Verificado</th>
                <th className="py-3 px-4">Completado</th>
                <th className="py-3 px-4">Fecha de Registro</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-t border-zinc-700 hover:bg-zinc-600">
                  <td className="py-3 px-4">
                    <Link
                      to={`/user/${user._id}`}
                      className="text-blue-400 hover:underline"
                    >
                      {user.username}
                    </Link>
                  </td>
                  <td className="py-3 px-4">{user.is_verified ? "Sí" : "No"}</td>
                  <td className="py-3 px-4">{user.completado ? "Sí" : "No"}</td>
                  <td className="py-3 px-4">
                    {user.fecha_registro
                      ? format(new Date(user.fecha_registro), "dd/MM/yyyy HH:mm")
                      : "Fecha no disponible"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
