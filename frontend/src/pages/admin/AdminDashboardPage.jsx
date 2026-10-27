import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../api/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  ShieldAlert, 
  Users, 
  Briefcase, 
  Building2, 
  Send, 
  Flag, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, logsRes, reportsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAuditLogs(),
        adminService.getReports(),
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (logsRes.data) setAuditLogs(logsRes.data.slice(0, 8));
      if (reportsRes.data) setPendingReports(reportsRes.data.filter((r) => r.status === 'PENDING'));
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <LoadingSpinner text="Loading administration platform..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      {/* Banner */}
      <div style={{
        backgroundColor: 'var(--color-dark-charcoal)',
        color: 'var(--color-white)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem 2.25rem',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        borderLeft: '6px solid var(--color-deep-maroon)'
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-saffron)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            BharatHire Governance & Security
          </span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-white)', marginTop: '2px', marginBottom: '0.4rem' }}>
            Platform Administration Hub
          </h1>
          <p style={{ color: 'var(--color-cream)', fontSize: '0.925rem', opacity: 0.9 }}>
            System-wide user control, enterprise KYC verification, content moderation, and audit compliance
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/users" className="btn btn-secondary btn-sm">
            <Users size={16} /> Manage Users
          </Link>
          <Link to="/admin/companies" className="btn btn-primary btn-sm">
            <Building2 size={16} /> Verify Companies
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-warm-grey)' }}>Total Users</span>
            <Users size={20} style={{ color: 'var(--color-deep-maroon)' }} />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-dark-charcoal)' }}>
            {stats?.totalUsers || 0}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey)', display: 'block', marginTop: '2px' }}>
            {stats?.totalCandidates || 0} candidates &bull; {stats?.totalRecruiters || 0} recruiters
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-warm-grey)' }}>Published Jobs</span>
            <Briefcase size={20} style={{ color: 'var(--color-saffron-dark)' }} />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-dark-charcoal)' }}>
            {stats?.totalJobs || 0}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey)', display: 'block', marginTop: '2px' }}>
            Active across Indian hubs
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-warm-grey)' }}>Total Applications</span>
            <Send size={20} style={{ color: 'var(--color-muted-green)' }} />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-dark-charcoal)' }}>
            {stats?.totalApplications || 0}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey)', display: 'block', marginTop: '2px' }}>
            Submitted candidates
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-warm-grey)' }}>Verified Employers</span>
            <ShieldCheck size={20} style={{ color: 'var(--color-muted-green)' }} />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-dark-charcoal)' }}>
            {stats?.verifiedCompanies || 0}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey)', display: 'block', marginTop: '2px' }}>
            Out of {stats?.totalCompanies || 0} employers
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: pendingReports.length > 0 ? '4px solid var(--color-error-red)' : '1px solid var(--color-soft-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-warm-grey)' }}>Pending Reports</span>
            <Flag size={20} style={{ color: pendingReports.length > 0 ? 'var(--color-error-red)' : 'var(--color-warm-grey)' }} />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: pendingReports.length > 0 ? 'var(--color-error-red)' : 'var(--color-dark-charcoal)' }}>
            {pendingReports.length}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey)', display: 'block', marginTop: '2px' }}>
            Needs moderation
          </span>
        </div>
      </div>

      {/* Grid: Pending Reports & Audit Trails */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {/* Pending Moderation Reports */}
        <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--color-white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
                Trust & Safety Queue
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--color-warm-grey)' }}>
                Flagged job postings needing administrative review
              </p>
            </div>
            <Link to="/admin/reports" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-deep-maroon)' }}>
              All Reports
            </Link>
          </div>

          {pendingReports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--color-warm-grey)' }}>
              <CheckCircle2 size={36} style={{ color: 'var(--color-muted-green)', margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Queue Clean</p>
              <span style={{ fontSize: '0.78rem' }}>No pending fraud or abuse flags currently reported.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {pendingReports.slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  style={{
                    padding: '0.9rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #F8C3BF',
                    backgroundColor: 'var(--color-error-red-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-error-red)' }}>
                      {r.reason}
                    </span>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-dark-charcoal)', marginTop: '2px' }}>
                      Job ID #{r.jobId} &bull; Reported {new Date(r.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  <Link to="/admin/reports" className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security & Audit Logs */}
        <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--color-white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
                Recent Security Audit Logs
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--color-warm-grey)' }}>
                System activity trails & administrative events
              </p>
            </div>
            <Link to="/admin/audit-logs" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-deep-maroon)' }}>
              Full Log ({auditLogs.length})
            </Link>
          </div>

          {auditLogs.length === 0 ? (
            <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.875rem' }}>No logs recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {auditLogs.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-warm-ivory)',
                    border: '1px solid var(--color-soft-border)',
                    fontSize: '0.8125rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--color-deep-maroon)' }}>{log.action}</strong>
                    <span style={{ color: 'var(--color-dark-charcoal)', marginLeft: '6px' }}>{log.details}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-warm-grey)', whiteSpace: 'nowrap' }}>
                    {new Date(log.createdAt).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
