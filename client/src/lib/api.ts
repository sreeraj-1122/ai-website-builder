import axios from 'axios';

export const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
});
