import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import { Link } from "react-router-dom";

function AdminPage() {
  const { getUsers, users, toggleVerificado, match } = useAuth();
  const [cmsLogFile, setCmsLogFile] = useState(null);
  const [contactFyle, setContactFyle] = useState(null);
  const [matchResult, setMatchResult] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const handleFileUpload = async () => {
    if (!cmsLogFile || !contactFyle) {
      setMatchResult({ success: false, message: "Por favor, selecciona ambos archivos." });
      return;
    }

    const formData = new FormData();
    formData.append("cms_log", cmsLogFile);
    formData.append("contact_csv", contactFyle);

    try {
      const respuesta = await match(formData);
      setMatchResult(respuesta);
      console.log("Archivos procesados correctamente", respuesta);
    } catch (error) {
      console.error("Error al procesar archivos:", error);
      setMatchResult({
        success: false,
        message: error.response?.data?.message || "Error al procesar los archivos.",
      });
    }
  };

  return (
    <div className="p-8 flex gap-8">
      <div className="w-2/3">
        <h1 className="text-center text-2xl font-bold mb-8 text-white">
          Administrar usuarios
        </h1>
        <div className="overflow-x-auto">
          {users.length === 0 ? (
            <p className="text-white text-center">No hay usuarios disponibles</p>
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
                      <Link to={`/user/${user._id}`} className="text-blue-400 hover:underline">
                        {user.fullname}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleVerificado(user._id)}
                        className={`px-3 py-1 rounded ${
                          user.is_verified ? "bg-green-600" : "bg-red-600"
                        } hover:opacity-80`}
                      >
                        {user.is_verified ? "Sí" : "No"}
                      </button>
                    </td>
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

      <div className="w-1/3 bg-zinc-800 text-white p-6 rounded shadow-lg h-fit">
        <h2 className="text-xl font-semibold mb-4">Subir archivos</h2>
        <div className="mb-4">
          <label className="block mb-1">Logs CMS (access):</label>
          <input
            type="file"
            accept="access.1"
            onChange={(e) => setCmsLogFile(e.target.files[0])}
            className="block w-full text-sm text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Contactos (CSV):</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setContactFyle(e.target.files[0])}
            className="block w-full text-sm text-white"
          />
        </div>
        <button
          onClick={handleFileUpload}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
        >
          Subir archivos
        </button>

        {/* Resultado del procesamiento */}
        {matchResult && (
          <div className={`mt-4 p-4 rounded ${matchResult.success ? "bg-green-700" : "bg-red-700"}`}>
            <p className="font-semibold">{matchResult.message}</p>
            {matchResult.success && (
              <ul className="mt-2 list-disc list-inside text-sm">
                <p></p>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
