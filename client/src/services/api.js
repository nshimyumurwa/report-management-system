import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// Departments
export const getDepartments = () => API.get('/departments');

// Roles
export const getRoles = () => API.get('/roles');

// Reports
export const createReport = (data) => API.post('/reports', data);
export const getReports = () => API.get('/reports');
export const getReportById = (id) => API.get(`/reports/${id}`);
export const getReportApprovals = (id) => API.get(`/reports/${id}/approvals`);
export const submitReport = (id, data) => API.put(`/reports/${id}/submit`, data);
export const reviewReport = (id, data) => API.put(`/reports/${id}/review`, data);

// Users
export const getUsers = () => API.get('/users');
export const getDepartmentHeads = () => API.get('/users/heads');

// File Upload
export const uploadFile = (formData) => API.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});