import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAffiliateLinks } from "../context/Affiliate_linksContext";
import { useAuth } from "../context/AuthContext";

function UserDetailPage() {
  const { id } = useParams();
  const { getAffiliateLinkbyId, affiliate_links, loading, errors } =
    useAffiliateLinks();
  const { getUserbyID, affiliateUser } = useAuth();

  // Obtener enlaces de afiliado
  useEffect(() => {
    if (id) getAffiliateLinkbyId(id);
  }, [id]);

  // Obtener datos del usuario
  useEffect(() => {
    if (id) getUserbyID(id);
  }, [id]);

  return (
    <div className="p-8 text-white">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-6">
          Información personal de {affiliateUser?.fullname || "usuario desconocido"}
        </h1>
        {affiliateUser && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-zinc-800 p-6 rounded shadow-md">
            <Info label="Nombre completo" value={affiliateUser.fullname} />
            <Info label="Email" value={affiliateUser.email} />
            <Info label="DNI" value={affiliateUser.dni} />
            <Info label="ID Afiliado" value={affiliateUser.id_afiliado} />
            <Info label="Identidad" value={affiliateUser.identidad} />
            <Info label="Cuenta bancaria" value={affiliateUser.cuenta_bancaria} />
            <Info label="RRSS 1" value={affiliateUser.rrss_1} />
            <Info label="RRSS 2" value={affiliateUser.rrss_2} />
            <Info label="RRSS 3" value={affiliateUser.rrss_3} />
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Enlaces de afiliado del usuario</h2>

      {loading ? (
        <p>Cargando enlaces...</p>
      ) : errors.length > 0 ? (
        <div className="text-red-400">
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      ) : affiliate_links.length === 0 ? (
        <p>No hay enlaces de afiliado para este usuario.</p>
      ) : (
        <table className="min-w-full bg-zinc-800 rounded shadow-lg mt-4">
          <thead>
            <tr className="bg-zinc-700 text-left">
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">UTM</th>
              <th className="py-2 px-4">Visitas</th>
              <th className="py-2 px-4">Leads</th>
              <th className="py-2 px-4">Comisión</th>
              <th className="py-2 px-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {affiliate_links.map((link) => (
              <tr key={link._id} className="border-t border-zinc-700">
                <td className="py-2 px-4">{link.nombre_enlace}</td>
                <td className="py-2 px-4">
                  <a
                    href={link.enlace_utm}
                    className="text-blue-400 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    UTM
                  </a>
                </td>
                <td className="py-2 px-4">{link.visitas}</td>
                <td className="py-2 px-4">{link.leads}</td>
                <td className="py-2 px-4">
                  {link.comision != null ? `${link.comision} €` : "—"}
                </td>
                <td className="py-2 px-4">
                  {link.total_generado != null ? `${link.total_generado} €` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Componente auxiliar para mostrar cada dato bonito
function Info({ label, value }) {
  return (
    <div className="flex flex-col bg-zinc-700 p-4 rounded">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="font-semibold">{value || "—"}</span>
    </div>
  );
}

export default UserDetailPage;
