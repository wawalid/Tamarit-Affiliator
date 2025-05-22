import axios from './axios';


export const matchRequest = (formData) =>
  axios.post("/match", formData);
