import api from './api';

export const applicationAPI = {
  getMyApplications: () => api.get('/applications/my-applications'),
  getEmployerApplications: () => api.get('/applications/my-applications-employer'),
  applyToJob: (jobId, applicationData) => api.post(`/applications/apply/${jobId}`, applicationData),
  acceptApplication: (appId) => api.put(`/applications/${appId}/accept`),
  rejectApplication: (appId) => api.put(`/applications/${appId}/reject`),
  updateStatus: (appId, status) => api.put(`/applications/${appId}/status/${status}`),
};

