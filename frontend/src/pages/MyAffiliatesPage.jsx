import { useAffiliateLinks } from "../context/Affiliate_linksContext";
import { useEffect } from "react";
import Affiliate_linkCard from "../components/Affiliate_linkCard";


function MyAffiliatesPage() {
  const { affiliate_links, getAffiliateLinks, loading } = useAffiliateLinks();

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
        
    </div>
  );
}

export default MyAffiliatesPage;
