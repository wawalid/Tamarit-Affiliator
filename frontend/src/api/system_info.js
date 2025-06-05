import axios from './axios';


export const getSystemInfoRequest = () => axios.get('/get_system_info');