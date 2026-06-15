// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 15000,
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fts_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const jobsApi = {
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
};

export const applicationsApi = {
  submit: (formData) =>
    api.post('/applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMy: () => api.get('/applications/my'),
};

export const contactApi = {
  send: (data) => api.post('/contact', data),
};

export default api;
