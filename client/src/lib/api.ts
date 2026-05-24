import axios from 'axios';

export const serverUrl =
  import.meta.env.VITE_SERVER_URL ?? 'https://ai-website-builder-pug6.onrender.com';

export const api = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
});
