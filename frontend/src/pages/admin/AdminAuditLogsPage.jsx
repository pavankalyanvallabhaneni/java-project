import React, { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ShieldCheck, Search, Filter } from 'lucide-react';

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAuditLogs();
      if (res.data) setLogs(res.data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((l) =>
    l.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.ipAddress?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <LoadingSpinner text="Loading platform audit trails..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-dark-charcoal)', marginBottom: '0.25rem' }}>
          Security & Compliance Audit Trails ({logs.length})
        </h1>
        <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.925rem' }}>
          Immutable logs tracking authentication, permission changes, verification, and recruitment milestones
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--color-white)' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-grey)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by action, IP, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Timestamp (IST)</th>
              <th>Action Executed</th>
              <th>Entity Type & ID</th>
              <th>IP Address</th>
              <th>Event Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td style={{ whiteSpace: 'nowrap', fontSize: '0.825rem', color: 'var(--color-warm-grey)' }}>
                  {new Date(log.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </td>

                <td>
                  <span style={{
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: log.action.includes('SUSPEND') || log.action.includes('FAIL') ? 'var(--color-error-red)' : 'var(--color-deep-maroon)',
                    fontFamily: 'monospace'
                  }}>
                    {log.action}
                  </span>
                </td>

                <td>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-dark-charcoal)' }}>
                    {log.entityType || 'SYSTEM'} {log.entityId ? `(#${log.entityId})` : ''}
                  </span>
                </td>

                <td>
                  <span style={{ fontSize: '0.825rem', color: 'var(--color-warm-grey)', fontFamily: 'monospace' }}>
                    {log.ipAddress || '127.0.0.1'}
                  </span>
                </td>

                <td>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-dark-charcoal)' }}>
                    {log.details}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditLogsPage;
