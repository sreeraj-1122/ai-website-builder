import axios from 'axios';

export const serverUrl = 'https://ai-website-builder-pug6.onrender.com' || import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
});
