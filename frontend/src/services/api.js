// frontend/src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Use environment variable
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchJobs = () => {
  return apiClient.get('/jobs');
};

export const createJob = (jobData) => {
  // jobData should be like { customerName: '...', description: '...' }
  return apiClient.post('/jobs', jobData);
};

export const updateJobStatus = (jobId, status) => {
  // status should be 'Not Yet Started', 'In Progress', or 'Completed'
  return apiClient.patch(`/jobs/${jobId}/status`, { status });
};

