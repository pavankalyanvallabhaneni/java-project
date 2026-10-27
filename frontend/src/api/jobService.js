import api from './axios';

export const jobService = {
  async searchJobs(params = {}) {
    const res = await api.get('/jobs', { params });
    return res.data;
  },

  async getJobById(id) {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  },

  async getCategories() {
    const res = await api.get('/jobs/categories');
    return res.data;
  },

  async getFeaturedJobs() {
    const res = await api.get('/jobs/featured');
    return res.data;
  },

  async reportJob(id, data) {
    const res = await api.post(`/jobs/${id}/report`, data);
    return res.data;
  },
};
