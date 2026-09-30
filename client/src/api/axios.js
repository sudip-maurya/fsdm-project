import axios from 'axios';

const rawBaseURL = (process.env.REACT_APP_API_URL || 'https://open-repository-backend.onrender.com/api').trim().replace(/\/+$/, '');
const baseURL = rawBaseURL.endsWith('/api') ? rawBaseURL : `${rawBaseURL}/api`;

export const BACKEND_URL = baseURL.replace(/\/api$/, '');

/**
 * Resolves a file path (report PDF or ZIP source code) to a full backend URL.
 * Handles local development, deployed environments, relative uploads paths,
 * Windows backslashes, and absolute URLs.
 */
export const getFileUrl = (filePath) => {
  if (!filePath) return null;
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  const cleanPath = filePath.replace(/\\/g, '/').replace(/^\/+/, '');
  const finalPath = cleanPath.startsWith('uploads/') ? cleanPath : `uploads/${cleanPath}`;
  return `${BACKEND_URL}/${finalPath}`;
};

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