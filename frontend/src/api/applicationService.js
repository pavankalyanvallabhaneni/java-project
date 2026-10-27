import api from './axios';

export const applicationService = {
  async apply(data) {
    const res = await api.post('/applications/apply', data);
    return res.data;
  },

  async getCandidateApplications() {
    const res = await api.get('/applications/my-applications');
    return res.data;
  },

  async getRecruiterApplications() {
    const res = await api.get('/applications/recruiter');
    return res.data;
  },

  async getJobApplicants(jobId) {
    const res = await api.get(`/applications/job/${jobId}`);
    return res.data;
  },

  async getApplicationDetails(id) {
    const res = await api.get(`/applications/${id}`);
    return res.data;
  },

  async updateStatus(id, data) {
    const res = await api.patch(`/applications/${id}/status`, data);
    return res.data;
  },

  async withdraw(id) {
    const res = await api.post(`/applications/${id}/withdraw`);
    return res.data;
  },

  async downloadResume(resumeId) {
    const response = await api.get(`/applications/resume/${resumeId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
