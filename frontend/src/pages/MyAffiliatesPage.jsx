import { useAffiliateLinks } from "../context/Affiliate_linksContext";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import InfoCard from "../components/InfoCard";


function MyAffiliatesPage() {
  const { affiliate_links, getAffiliateLinks, loading } = useAffiliateLinks();
  const {user} = useAuth();

  useEffect(() => {
    getAffiliateLinks();
  }, []);

  if (loading) return <p className="text-white">Cargando enlaces...</p>;

  if (affiliate_links.length === 0) {
    return (
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md flex items-center justify-center">
        <h1 className="text-white">No tienes enlaces de afiliado</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div>
                {user && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-zinc-800 p-6 rounded shadow-md">
            <InfoCard label="Fullname" value={user.fullname} />
            <InfoCard label="Email" value={user.email} />
            <InfoCard label="DNI" value={user.dni} />
            <InfoCard label="Affiliate ID" value={user.id_afiliado} />
            <InfoCard label="Bank name" value={user.identidad} />
            <InfoCard label="Bank account" value={user.cuenta_bancaria} />
            <InfoCard label="Social media 1" value={user.rrss_1} />
            <InfoCard label="Social media 2" value={user.rrss_2} />
            <InfoCard label="Social media 3" value={user.rrss_3} />
          </div>
        )}
      </div>
        <table className="min-w-full bg-zinc-800 rounded shadow-lg mt-4">
          <thead>
            <tr className="bg-zinc-700 text-left">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">URL</th>
              <th className="py-2 px-4">Visits</th>
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
                    URL
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
        
    </div>
  );
}

export default MyAffiliatesPage;
