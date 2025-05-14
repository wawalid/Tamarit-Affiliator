import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAffiliateLinks } from "../context/Affiliate_linksContext";

function UserDetailPage() {
  const { id } = useParams();
  const { getAffiliateLinkbyId, affiliate_links, loading, errors } = useAffiliateLinks();

  useEffect(() => {
    getAffiliateLinkbyId(id);
  }, [id]);

  return (
    <div className="p-8 text-white">
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
              {/* <th className="py-2 px-4">Original</th> */}
              <th className="py-2 px-4">UTM</th>
              <th className="py-2 px-4">Visitas</th>
              <th className="py-2 px-4">Leads</th>
              <th className="py-2 px-4">Comisión</th>
              <th className="py-2 px-4">Total</th>
              {/* <th className="py-2 px-4">Código</th> */}
              
            </tr>
          </thead>
          <tbody>
            {affiliate_links.map((link) => (
              <tr key={link._id} className="border-t border-zinc-700">
                <td className="py-2 px-4">{link.nombre_enlace}</td>
                {/* <td className="py-2 px-4">
                  <a href={link.enlace_original} className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">
                    Original
                  </a>
                </td> */}
                <td className="py-2 px-4">
                  <a href={link.enlace_utm} className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">
                    UTM
                  </a>
                </td>
                {/* <td className="py-2 px-4">{link.codigo_descuento}</td> */}
                <td className="py-2 px-4">x</td>
                <td className="py-2 px-4">x</td>
                <td className="py-2 px-4">x</td>
                <td className="py-2 px-4">x</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserDetailPage;