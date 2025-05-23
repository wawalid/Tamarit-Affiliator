import axios from './axios';


export const registerRequest = (user) => axios.post(`/register`, user)
export const loginRequest = (user) => axios.post(`/login`, user)
export const verifyTokenRequest = () => {
  return axios.get("/verify", { withCredentials: true });
};
export const logoutRequest = () => {
  return axios.post("/logout", {}, { withCredentials: true });
};

export const updateUserRequest = (user) => axios.patch('/profile', user)