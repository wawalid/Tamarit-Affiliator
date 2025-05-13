import { createContext, useContext, useState, useEffect } from "react";
import { getAffiliateLinksRequest, getAffiliateLinkbyIDRequest, createAffiliateLinkRequest, deleteAffiliateLinkRequest } from "../api/affiliate_links";

export const Affiliate_linkContext = createContext();

export const useAffiliateLinks = () => {
  const context = useContext(Affiliate_linkContext);
  if (!context) {
    throw new Error("useAffiliateLinks must be used within an AffiliateLinkProvider");
  }
  return context;
};



export const AffiliateLinkProvider = ({ children }) => {
  const [affiliate_links, setAffiliateLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  
  const getAffiliateLinkbyId = async (id) => {
    try {
      const res = await getAffiliateLinkbyIDRequest(id);
      setAffiliateLinks(res.data);
      console.log("enlace obtenido:", res.data);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      setErrors(error.response.data);
    }
  }

  const getAffiliateLinks = async () => {
    try {
      const res = await getAffiliateLinksRequest();
      setAffiliateLinks(res.data);
      console.log("enlaces obtenidos:", res.data);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      setErrors(error.response.data);
    }
  };

  const createAffiliateLink = async (affiliate_link) => {
    try {
      const res = await createAffiliateLinkRequest(affiliate_link);
      console.log("Affiliate link created successfully");
      return true
    } catch (error) {
      setErrors(error.response.data);
      return false
    }
  };

  const deleteAffiliateLink = async (id) => {
    try {
      const res = await deleteAffiliateLinkRequest(id);
      if (res.status === 204) {
        setAffiliateLinks(
          affiliate_links.filter((affiliate_link) => affiliate_link._id !== id)
        );
        console.log("Affiliate link deleted successfully");
      }
    } catch (error) {
      console.log(error.response);
      setErrors(error.response.data);
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <Affiliate_linkContext.Provider
      value={{
        affiliate_links,
        getAffiliateLinkbyId,
        getAffiliateLinks,
        createAffiliateLink,
        deleteAffiliateLink,
        loading,
        errors,
      }}
    >
      {children}
    </Affiliate_linkContext.Provider>
  );
};
