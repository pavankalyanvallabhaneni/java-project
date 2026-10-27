import React, { useState } from 'react';
import { jobService } from '../../api/jobService';
import Modal from '../common/Modal';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const ReportModal = ({ isOpen, onClose, jobId, jobTitle }) => {
  const [reason, setReason] = useState('Fraudulent / Scam');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const reportReasons = [
    'Fraudulent / Scam / Fake Job',
    'Asks for money / upfront payment',
    'Inaccurate salary or job requirements',
    'Misleading company information',
    'Spam or duplicate job posting',
    'Discriminatory or offensive content',
    'Other reason',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      await jobService.reportJob(jobId, { reason, details });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setDetails('');
      }, 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Job Posting"
      maxWidth="500px"
    >
      {success ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <CheckCircle2 size={48} style={{ color: 'var(--color-muted-green)', margin: '0 auto 0.75rem' }} />
          <h4 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-dark-charcoal)' }}>
            Report Submitted
          </h4>
          <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.875rem' }}>
            Thank you for helping keep the BharatHire community safe. Our trust and moderation team will review this posting promptly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <p style={{ fontSize: '0.875rem', color: 'var(--color-warm-grey)', marginBottom: '1.25rem' }}>
            Reporting: <strong>{jobTitle}</strong>
          </p>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Reason for reporting</label>
            <select
              className="form-select"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              {reportReasons.map((r, idx) => (
                <option key={idx} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Additional Details / Evidence</label>
            <textarea
              rows="3"
              className="form-control"
              placeholder="Please provide any specific information to assist our moderation review..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-danger btn-sm"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ReportModal;
