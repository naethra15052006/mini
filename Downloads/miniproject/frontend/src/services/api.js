import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// User API
export const userAPI = {
  getWorkers: () => api.get('/users/workers'),
  getEmployers: () => api.get('/users/employers'),
  getAllUsers: () => api.get('/users'),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Job API
export const jobAPI = {
  postJob: (jobData) => api.post('/jobs', jobData),
  getAllJobs: () => api.get('/jobs'),
  getNearbyJobs: (lat, lng) => api.get(`/jobs/nearby?latitude=${lat}&longitude=${lng}`),
  getMyJobs: () => api.get('/jobs/my-jobs'),
  getJobById: (id) => api.get(`/jobs/${id}`),
  getJobApplications: (jobId) => api.get(`/jobs/${jobId}/applications`),
  closeJob: (id) => api.put(`/jobs/${id}/close`),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
};

// Payment API
export const paymentAPI = {
  markAsPaid: (jobId) => api.post(`/payments/pay/${jobId}`),
  getMyPayments: () => api.get('/payments/my-payments'),
};

// Rating API
export const ratingAPI = {
  giveRating: (userId, ratingValue) => api.post(`/ratings?userId=${userId}&ratingValue=${ratingValue}`),
  getRatingsForUser: (userId) => api.get(`/ratings/user/${userId}`),
  getAverageRating: (userId) => api.get(`/ratings/user/${userId}/average`),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/users/admin/stats'),
  getRecentUsers: () => api.get('/users/admin/recent-users'),
  getWorkers: () => api.get('/users/admin/workers'),
  getEmployers: () => api.get('/users/admin/employers'),
  blockUser: (id) => api.put(`/users/admin/users/${id}/block`),
  unblockUser: (id) => api.put(`/users/admin/users/${id}/unblock`),
  getAllJobs: () => api.get('/jobs/admin/jobs'),
  deleteJob: (id) => api.delete(`/jobs/admin/jobs/${id}`),
  updateJobStatus: (id, status) => api.put(`/jobs/admin/jobs/${id}/status/${status}`),
  getEmployerJobs: (employerId) => api.get(`/jobs/admin/employer/${employerId}/jobs`),
};

export default api;

