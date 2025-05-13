import axios from './axios';


export const getAffiliateLinksRequest = () => axios.get('/affiliate_links')
export const getAffiliateLinkbyIDRequest = (id) => axios.get(`/affiliate_links/${id}`)
export const createAffiliateLinkRequest = (affiliateLink) => axios.post('/affiliate_links', affiliateLink)
export const deleteAffiliateLinkRequest = (id) => axios.delete(`/affiliate_links/${id}`)