import api from './axios';

export const candidateService = {
  async getProfile() {
    const res = await api.get('/candidate/profile');
    return res.data;
  },

  async updateProfile(data) {
    const res = await api.put('/candidate/profile', data);
    return res.data;
  },

  async addSkill(skill) {
    const res = await api.post('/candidate/skills', skill);
    return res.data;
  },

  async deleteSkill(id) {
    const res = await api.delete(`/candidate/skills/${id}`);
    return res.data;
  },

  async addEducation(edu) {
    const res = await api.post('/candidate/education', edu);
    return res.data;
  },

  async deleteEducation(id) {
    const res = await api.delete(`/candidate/education/${id}`);
    return res.data;
  },

  async addExperience(exp) {
    const res = await api.post('/candidate/experience', exp);
    return res.data;
  },

  async deleteExperience(id) {
    const res = await api.delete(`/candidate/experience/${id}`);
    return res.data;
  },

  async uploadResume(formData) {
    const res = await api.post('/candidate/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async deleteResume(id) {
    const res = await api.delete(`/candidate/resumes/${id}`);
    return res.data;
  },

  async getSavedJobs() {
    const res = await api.get('/candidate/saved-jobs');
    return res.data;
  },

  async saveJob(jobId) {
    const res = await api.post(`/candidate/saved-jobs/${jobId}`);
    return res.data;
  },

  async unsaveJob(jobId) {
    const res = await api.delete(`/candidate/saved-jobs/${jobId}`);
    return res.data;
  },

  async getInterviews() {
    const res = await api.get('/candidate/interviews');
    return res.data;
  },
};
