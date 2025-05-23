import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const instance = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    withCredentials: false,
})

export default instance;
