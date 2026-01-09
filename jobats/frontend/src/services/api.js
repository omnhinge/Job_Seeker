import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadResume = async (formData) => {
  const response = await api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const analyzeResume = async (email) => {
  const response = await api.post('/analysis/analyze', { email });
  return response.data;
};

export const generateCareerPlan = async (email, targetJob) => {
  const response = await api.post('/analysis/career-plan', { email, targetJob });
  return response.data;
};

export const getAnalysis = async (email) => {
  const response = await api.get(`/analysis/${email}`);
  return response.data;
};

export default api;