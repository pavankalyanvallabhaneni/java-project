import React, { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { Users, Search, Shield, UserCheck, UserX, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers(page, 15);
      if (res.data) {
        setUsers(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setAlert({ type: 'danger', message: 'Unable to retrieve user directory.' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (!window.confirm(`Are you sure you want to change status for ${user.fullName} to ${nextStatus}?`)) {
      return;
    }

    try {
      setUpdatingId(user.id);
      const res = await adminService.updateUserStatus(user.id, nextStatus);
      if (res.data) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
        );
        setAlert({ type: 'success', message: `User ${user.fullName} is now ${nextStatus}.` });
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to update user status.' });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      searchTerm === '' ||
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <LoadingSpinner text="Retrieving user directory..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-dark-charcoal)', marginBottom: '0.25rem' }}>
          Platform User Management ({totalElements})
        </h1>
        <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.925rem' }}>
          Inspect candidate and recruiter accounts, enforce security policies, and manage access privileges
        </p>
      </div>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} style={{ marginBottom: '1.5rem' }}>
          {alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--color-white)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          {/* Search input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-grey)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
          </div>

          {/* Role pills */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { label: 'All Roles', value: 'ALL' },
              { label: 'Candidates', value: 'ROLE_CANDIDATE' },
              { label: 'Recruiters', value: 'ROLE_RECRUITER' },
              { label: 'Admins', value: 'ROLE_ADMIN' },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`btn btn-sm ${roleFilter === tab.value ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRoleFilter(tab.value)}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>User Name & Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Account Status</th>
              <th>Registered On</th>
              <th style={{ textAlign: 'right' }}>Security Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-dark-charcoal)', display: 'block' }}>
                    {u.fullName}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-warm-grey)' }}>
                    {u.email}
                  </span>
                </td>

                <td>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-dark-charcoal)' }}>
                    {u.phone || 'N/A'}
                  </span>
                </td>

                <td>
                  <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-maroon' : u.role === 'ROLE_RECRUITER' ? 'badge-saffron' : 'badge-grey'}`} style={{ fontSize: '0.75rem' }}>
                    {u.role?.replace('ROLE_', '')}
                  </span>
                </td>

                <td>
                  <Badge variant={u.status === 'ACTIVE' ? 'green' : 'red'} style={{ fontSize: '0.75rem' }}>
                    {u.status}
                  </Badge>
                </td>

                <td>
                  <span style={{ fontSize: '0.825rem', color: 'var(--color-warm-grey)' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </td>

                <td style={{ textAlign: 'right' }}>
                  {u.role !== 'ROLE_ADMIN' && (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(u)}
                      disabled={updatingId === u.id}
                      className={`btn btn-sm ${u.status === 'ACTIVE' ? 'btn-danger' : 'btn-secondary'}`}
                      style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                    >
                      {updatingId === u.id ? 'Updating...' : u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '2rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Page {page + 1} of {totalPages}</span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
