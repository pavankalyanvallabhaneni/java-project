import api from './axios';

export const adminService = {
  async getStats() {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  async getUsers(page = 0, size = 15) {
    const res = await api.get('/admin/users', { params: { page, size } });
    return res.data;
  },

  async updateUserStatus(id, status) {
    const res = await api.patch(`/admin/users/${id}/status`, { status });
    return res.data;
  },

  async getCompanies() {
    const res = await api.get('/admin/companies');
    return res.data;
  },

  async verifyCompany(id, verify) {
    const res = await api.patch(`/admin/companies/${id}/verify`, { verify });
    return res.data;
  },

  async getReports() {
    const res = await api.get('/admin/reports');
    return res.data;
  },

  async resolveReport(id, status, notes) {
    const res = await api.patch(`/admin/reports/${id}/resolve`, { status, notes });
    return res.data;
  },

  async getAuditLogs() {
    const res = await api.get('/admin/audit-logs');
    return res.data;
  },
};
