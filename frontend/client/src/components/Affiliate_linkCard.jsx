import { useAffiliateLinks } from "../context/Affiliate_linksContext";
import { Link } from "react-router-dom";

function Affiliate_linkCard({ affiliate_link }) {
  const { } = useAffiliateLinks();

  const shortenLink = (link, maxLength = 40) => {
    if (link.length <= maxLength) return link;
    return link.slice(0, maxLength) + "...";
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(affiliate_link.enlace_utm);
      alert("¡Enlace copiado al portapapeles!");
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  return (
    <div className="bg-zinc-800 max-w-4xl w-full p-12 rounded-md flex flex-col items-center justify-center m-2">
      <header className="flex justify-between w-full mb-4">
        <h1 className="text-2xl font-bold">{affiliate_link.nombre_enlace}</h1>
      </header>

      <div
        className="relative group w-full text-center mb-4 cursor-pointer"
        onClick={copyToClipboard}
        title="Haz clic para copiar"
      >
        <p className="text-slate-300 text-sm truncate">
          {shortenLink(affiliate_link.enlace_utm)}
        </p>
        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-zinc-700 text-white text-xs rounded py-1 px-2 z-10 w-max max-w-xl mx-auto left-1/2 -translate-x-1/2">
          {affiliate_link.enlace_utm}
        </div>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4 w-full text-center">
        <p className="text-slate-300 text-sm">{affiliate_link.visitas} Visitas</p>
        <p className="text-slate-300 text-sm">{affiliate_link.leads} Leads</p>
        <p className="text-slate-300 text-sm">{affiliate_link.ventas} Ventas</p>
        <p className="text-slate-300 text-sm">{affiliate_link.comision}€ Comisión</p>
      </div>
    </div>
  );
}

export default Affiliate_linkCard;
