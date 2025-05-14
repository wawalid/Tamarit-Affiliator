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
      {affiliate_links.map((link) => (
        <Affiliate_linkCard key={link._id} affiliate_link={link} />
      ))}
    </div>
  );
}

export default MyAffiliatesPage;
