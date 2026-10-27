import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../api/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { Flag, CheckCircle2, AlertCircle, Eye, ExternalLink } from 'lucide-react';

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Resolve Modal
  const [resolveModalReport, setResolveModalReport] = useState(null);
  const [resolveStatus, setResolveStatus] = useState('RESOLVED');
  const [resolveNotes, setResolveNotes] = useState('Reviewed by Trust & Safety administrator.');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await adminService.getReports();
      if (res.data) setReports(res.data);
    } catch (err) {
      console.error('Failed to load reports:', err);
      setAlert({ type: 'danger', message: 'Unable to retrieve moderation queue.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!resolveModalReport) return;

    try {
      setSubmitting(true);
      const res = await adminService.resolveReport(resolveModalReport.id, resolveStatus, resolveNotes);
      if (res.data) {
        setReports((prev) =>
          prev.map((r) => (r.id === resolveModalReport.id ? res.data : r))
        );
        setAlert({ type: 'success', message: `Report marked as ${resolveStatus}.` });
      }
      setResolveModalReport(null);
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to resolve report.' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <LoadingSpinner text="Loading trust & safety reports..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-dark-charcoal)', marginBottom: '0.25rem' }}>
          Job Moderation & Safety Queue ({reports.length})
        </h1>
        <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.925rem' }}>
          Investigate reported fraudulent or suspicious postings and protect Indian job seekers
        </p>
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
          { label: 'All Reports', value: 'ALL', count: reports.length },
          { label: 'Pending Review', value: 'PENDING', count: reports.filter(r => r.status === 'PENDING').length },
          { label: 'Resolved / Actioned', value: 'RESOLVED', count: reports.filter(r => r.status === 'RESOLVED').length },
          { label: 'Dismissed', value: 'DISMISSED', count: reports.filter(r => r.status === 'DISMISSED').length },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`btn btn-sm ${statusFilter === tab.value ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter(tab.value)}
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {filteredReports.length === 0 ? (
        <EmptyState
          icon={Flag}
          title="No reports in this category"
          description="There are currently no reported job postings matching this filter."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="card"
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--color-white)',
                borderLeft: report.status === 'PENDING' ? '4px solid var(--color-error-red)' : '4px solid var(--color-muted-green)'
              }}
            >
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                    <span className="badge badge-red" style={{ fontSize: '0.75rem' }}>
                      {report.reason}
                    </span>
                    <Badge variant={report.status === 'PENDING' ? 'red' : 'green'}>
                      {report.status}
                    </Badge>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '0.25rem' }}>
                    Target Job ID #{report.job?.id || report.jobId}: {report.job?.title || 'Job Posting'}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-warm-grey)' }}>
                    Reported on {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {report.job?.id && (
                    <Link
                      to={`/jobs/${report.job.id}`}
                      target="_blank"
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      Inspect Job <ExternalLink size={12} />
                    </Link>
                  )}

                  {report.status === 'PENDING' && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setResolveModalReport(report)}
                    >
                      Resolve / Action
                    </button>
                  )}
                </div>
              </div>

              {report.details && (
                <div style={{
                  backgroundColor: 'var(--color-warm-ivory)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  color: 'var(--color-dark-charcoal)',
                  marginBottom: report.resolutionNotes ? '0.75rem' : '0',
                  border: '1px solid var(--color-soft-border)'
                }}>
                  <strong>Report Details from Candidate:</strong> &ldquo;{report.details}&rdquo;
                </div>
              )}

              {report.resolutionNotes && (
                <div style={{ fontSize: '0.825rem', color: 'var(--color-muted-green)', fontWeight: 600 }}>
                  Admin Resolution: {report.resolutionNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Resolve Modal */}
      {resolveModalReport && (
        <Modal
          isOpen={!!resolveModalReport}
          onClose={() => setResolveModalReport(null)}
          title={`Resolve Moderation Report #${resolveModalReport.id}`}
          maxWidth="500px"
        >
          <form onSubmit={handleResolveSubmit}>
            <div className="form-group">
              <label className="form-label">Resolution Status</label>
              <select
                className="form-select"
                value={resolveStatus}
                onChange={(e) => setResolveStatus(e.target.value)}
              >
                <option value="RESOLVED">RESOLVED (Action taken / warning issued)</option>
                <option value="DISMISSED">DISMISSED (False alarm / verified legitimate)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Resolution Notes / Action Taken</label>
              <textarea
                rows="3"
                className="form-control"
                value={resolveNotes}
                onChange={(e) => setResolveNotes(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setResolveModalReport(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Save Resolution'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminReportsPage;
