import axios from 'axios';

const rawBaseURL = (process.env.REACT_APP_API_URL || 'https://open-repository-backend.onrender.com/api').trim().replace(/\/+$/, '');
const baseURL = rawBaseURL.endsWith('/api') ? rawBaseURL : `${rawBaseURL}/api`;

const API = axios.create({
  baseURL,
});

// Automatically attach the token to every request if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;