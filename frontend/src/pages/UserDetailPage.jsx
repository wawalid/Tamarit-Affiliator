import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAffiliateLinks } from "../context/Affiliate_linksContext";
import { useAuth } from "../context/AuthContext";
import InfoCard from "../components/InfoCard";

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
          {affiliateUser?.fullname || "usuario desconocido"}
          's details
        </h1>
        {affiliateUser && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-zinc-800 p-6 rounded shadow-md">
            <InfoCard label="Fullname" value={affiliateUser.fullname} />
            <InfoCard label="Email" value={affiliateUser.email} />
            <InfoCard label="DNI" value={affiliateUser.dni} />
            <InfoCard label="Affiliate ID" value={affiliateUser.id_afiliado} />
            <InfoCard label="Bank name" value={affiliateUser.identidad} />
            <InfoCard
              label="Bank account"
              value={affiliateUser.cuenta_bancaria}
            />
            <InfoCard label="Social media 1" value={affiliateUser.rrss_1} />
            <InfoCard label="Social media 2" value={affiliateUser.rrss_2} />
            <InfoCard label="Social media 3" value={affiliateUser.rrss_3} />
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">
        User affiliate links
      </h2>

      {loading ? (
        <p>Loading links...</p>
      ) : errors.length > 0 ? (
        <div className="text-red-400">
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      ) : affiliate_links.length === 0 ? (
        <p>There are no affiliate links for this user.</p>
      ) : (
        <table className="min-w-full bg-zinc-800 rounded shadow-lg mt-4">
          <thead>
            <tr className="bg-zinc-700 text-left">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">URL</th>
              <th className="py-2 px-4">Visits</th>
              <th className="py-2 px-4">Leads</th>
              <th className="py-2 px-4">Commission</th>
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
                    URL
                  </a>
                </td>
                <td className="py-2 px-4">{link.visitas}</td>
                <td
                  className="py-2 px-4"
                  onClick={() => {
                    const contactos =
                      link.registro_leads
                        ?.map((lead) => lead.contacto)
                        .join("\n") || "Sin contactos";
                    alert(`Leads:\n${contactos}`);
                  }}
                >
                  {link.leads}
                </td>
                <td className="py-2 px-4">
                  {link.comision != null ? `${link.comision} €` : "—"}
                </td>
                <td className="py-2 px-4">
                  {link.ventas != null
                    ? `${link.ventas} €`
                    : "—"}
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

export default UserDetailPage;
