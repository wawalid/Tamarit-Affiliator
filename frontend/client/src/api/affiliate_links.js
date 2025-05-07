import axios from './axios';

import { use } from 'react';


// export const registerRequest = (user) => axios.post(`/register`, user)
// export const loginRequest = (user) => axios.post(`/login`, user)
// export const verifyTokenRequest = () => axios.get('/verify')
// export const logoutRequest = () => axios.post('/logout')
// export const updateUserRequest = (user) => axios.patch('/profile', user)

export const createAffiliateLinkRequest = (affiliateLink) => axios.post('/affiliate_links', affiliateLink)
export const getAffiliateLinksRequest = () => axios.get('/affiliate_links')
export const deleteAffiliateLinkRequest = (id) => axios.delete(`/affiliate_links/${id}`)