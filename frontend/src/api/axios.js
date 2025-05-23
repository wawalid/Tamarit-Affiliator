import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
axios.defaults.withCredentials = true;
const instance = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    withCredentials: true,
})

export default instance;
