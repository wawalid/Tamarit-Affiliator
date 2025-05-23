import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

const instance = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
})

export default instance;
