// frontend/src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchJobs = () => {
  return apiClient.get('/jobs');
};

export const createJob = (jobData) => {
  return apiClient.post('/jobs', jobData);
};

export const updateJobStatus = (jobId, status) => {
  return apiClient.patch(`/jobs/${jobId}/status`, { status });
};

