import axios from 'axios';

const baseURL = import.meta.env.VITE_WHITE_SHADOW_API_URL;

export const axiosClient = axios.create({ baseURL });
