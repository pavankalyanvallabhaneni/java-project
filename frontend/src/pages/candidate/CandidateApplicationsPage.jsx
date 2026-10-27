import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../api/applicationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  FileText, 
  ExternalLink, 
  AlertCircle,
  Eye,
  Building2,
  MapPin
} from 'lucide-react';

const CandidateApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationService.getCandidateApplications();
      if (res.data) setApplications(res.data);
    } catch (err) {
      console.error('Failed to load candidate applications:', err);
      setAlert({ type: 'danger', message: 'Unable to load applications list.' });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be reversed.')) {
      return;
    }
    try {
      setWithdrawingId(id);
      await applicationService.withdraw(id);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, currentStatus: 'Withdrawn' } : app))
      );
      setAlert({ type: 'success', message: 'Application has been withdrawn successfully.' });
      if (selectedApp?.id === id) {
        setSelectedApp(null);
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to withdraw application.' });
    } finally {
      setWithdrawingId(null);
    }
  };

  const filteredApps = applications.filter((app) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'ACTIVE') return !['Selected', 'Rejected', 'Withdrawn'].includes(app.currentStatus);
    return app.currentStatus.toUpperCase() === filterStatus;
  });

  const getStatusBadgeVariant = (status) => {
    const s = status?.toLowerCase().replace(/\s+/g, '-');
    return s;
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <LoadingSpinner text="Retrieving your job applications..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-dark-charcoal)', marginBottom: '0.25rem' }}>
            My Job Applications
          </h1>
          <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.925rem' }}>
            Track real-time hiring progress, stage transitions, and recruiter feedback
          </p>
        </div>

        <Link to="/jobs" className="btn btn-primary btn-sm">
          Browse More Jobs
        </Link>
      </div>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} style={{ marginBottom: '1.5rem' }}>
          {alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        borderBottom: '1px solid var(--color-soft-border)',
        paddingBottom: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        {[
          { label: 'All Applications', value: 'ALL', count: applications.length },
          { label: 'Active Pipeline', value: 'ACTIVE', count: applications.filter(a => !['Selected', 'Rejected', 'Withdrawn'].includes(a.currentStatus)).length },
          { label: 'Shortlisted', value: 'SHORTLISTED', count: applications.filter(a => a.currentStatus === 'Shortlisted').length },
          { label: 'Interviews', value: 'INTERVIEW SCHEDULED', count: applications.filter(a => a.currentStatus === 'Interview Scheduled').length },
          { label: 'Selected', value: 'SELECTED', count: applications.filter(a => a.currentStatus === 'Selected').length },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`btn btn-sm ${filterStatus === tab.value ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus(tab.value)}
            style={{ fontSize: '0.825rem', padding: '0.35rem 0.8rem' }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <EmptyState
          icon={Send}
          title="No applications found"
          description={filterStatus === 'ALL' ? "You haven't submitted any job applications yet." : `No applications currently in status "${filterStatus}".`}
          action={
            <Link to="/jobs" className="btn btn-primary btn-sm">
              Discover Open Positions
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="card"
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--color-white)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-cream)',
                  color: 'var(--color-deep-maroon)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  border: '1px solid var(--color-soft-border)',
                  flexShrink: 0
                }}>
                  {app.companyName?.charAt(0) || 'C'}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-dark-charcoal)' }}>
                      {app.companyName}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey)' }}>
                      &bull; Applied on {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <Link to={`/jobs/${app.jobId}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '0.5rem' }}>
                      {app.jobTitle}
                    </h3>
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--color-warm-grey)' }}>
                    <span>Candidate: {app.candidateName}</span>
                    {app.resumeFileName && <span>&bull; Resume: {app.resumeFileName}</span>}
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Badge variant={getStatusBadgeVariant(app.currentStatus)} style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
                  {app.currentStatus}
                </Badge>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedApp(app)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Eye size={14} /> Timeline
                  </button>

                  {app.currentStatus !== 'Withdrawn' && app.currentStatus !== 'Selected' && app.currentStatus !== 'Rejected' && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => handleWithdraw(app.id)}
                      disabled={withdrawingId === app.id}
                      style={{ color: 'var(--color-error-red)', borderColor: 'var(--color-error-red)' }}
                    >
                      {withdrawingId === app.id ? 'Withdrawing...' : 'Withdraw'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Timeline Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Application Details: ${selectedApp.jobTitle}`}
          maxWidth="600px"
        >
          <div>
            <div style={{
              backgroundColor: 'var(--color-warm-ivory)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              border: '1px solid var(--color-soft-border)'
            }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
                {selectedApp.jobTitle}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-warm-grey)', marginBottom: '0.5rem' }}>
                {selectedApp.companyName}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Current Status:</span>
                <Badge variant={getStatusBadgeVariant(selectedApp.currentStatus)}>
                  {selectedApp.currentStatus}
                </Badge>
              </div>
            </div>

            {selectedApp.coverLetter && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '0.35rem' }}>
                  Your Pitch / Cover Letter:
                </h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-warm-grey)', backgroundColor: 'var(--color-white)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-soft-border)' }}>
                  {selectedApp.coverLetter}
                </p>
              </div>
            )}

            {/* Status Transition History Timeline */}
            <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '1rem' }}>
              Status Progression Timeline
            </h5>

            {(!selectedApp.statusHistory || selectedApp.statusHistory.length === 0) ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-warm-grey)' }}>
                Application was recorded on {new Date(selectedApp.appliedAt).toLocaleDateString('en-IN')}. Pending recruiter review.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '2px solid var(--color-deep-maroon)', paddingLeft: '1.25rem', marginLeft: '0.5rem' }}>
                {selectedApp.statusHistory.map((h, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-27px',
                      top: '2px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-deep-maroon)',
                      border: '2px solid var(--color-white)'
                    }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-dark-charcoal)' }}>
                        {h.newStatus}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey)' }}>
                        {new Date(h.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {h.comments && (
                      <p style={{ fontSize: '0.825rem', color: 'var(--color-warm-grey)', marginTop: '2px' }}>
                        Note: &ldquo;{h.comments}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedApp(null)}
              >
                Close Timeline
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CandidateApplicationsPage;
