import api from './axios';

export const recruiterService = {
  async getProfile() {
    const res = await api.get('/recruiter/profile');
    return res.data;
  },

  async updateProfile(data) {
    const res = await api.put('/recruiter/profile', data);
    return res.data;
  },

  async getMyJobs() {
    const res = await api.get('/recruiter/jobs');
    return res.data;
  },

  async createJob(data) {
    const res = await api.post('/recruiter/jobs', data);
    return res.data;
  },

  async updateJob(id, data) {
    const res = await api.put(`/recruiter/jobs/${id}`, data);
    return res.data;
  },

  async deleteJob(id) {
    const res = await api.delete(`/recruiter/jobs/${id}`);
    return res.data;
  },

  async getAnalytics() {
    const res = await api.get('/recruiter/analytics');
    return res.data;
  },

  async scheduleInterview(data) {
    const res = await api.post('/recruiter/interviews', data);
    return res.data;
  },

  async getInterviews() {
    const res = await api.get('/recruiter/interviews');
    return res.data;
  },
};
