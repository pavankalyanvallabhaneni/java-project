import React, { useState, useEffect } from 'react';
import { applicationService } from '../../api/applicationService';
import { candidateService } from '../../api/candidateService';
import Modal from '../common/Modal';
import { FileText, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

const ApplyModal = ({ isOpen, onClose, job, onApplied }) => {
  const [profile, setProfile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess(false);
      loadCandidateProfile();
    }
  }, [isOpen]);

  const loadCandidateProfile = async () => {
    try {
      const res = await candidateService.getProfile();
      if (res.data) {
        setProfile(res.data);
        const resumeList = res.data.resumes || [];
        setResumes(resumeList);
        const primary = resumeList.find((r) => r.isPrimary) || resumeList[0];
        if (primary) setSelectedResumeId(primary.id);
      }
    } catch (err) {
      console.error('Failed to load profile for application:', err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF format resume.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Resume file size must be less than 5MB.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const formData = new FormData();
      formData.append('file', file);
      const res = await candidateService.uploadResume(formData);
      if (res.data) {
        setResumes((prev) => [res.data, ...prev]);
        setSelectedResumeId(res.data.id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedResumeId) {
      setError('Please upload or select a resume before submitting your application.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await applicationService.apply({
        jobId: job.id,
        resumeId: selectedResumeId,
        coverLetter,
      });
      setSuccess(true);
      if (onApplied) onApplied(job.id);
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. You may have already applied.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply for ${job?.title}`}
      maxWidth="600px"
    >
      {success ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <CheckCircle2 size={56} style={{ color: 'var(--color-muted-green)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-dark-charcoal)' }}>
            Application Submitted Successfully!
          </h3>
          <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.925rem' }}>
            The hiring team at <strong>{job?.companyName}</strong> has received your profile and credentials. You can track status updates in your applications dashboard.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Job Recap */}
          <div style={{
            backgroundColor: 'var(--color-warm-ivory)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            border: '1px solid var(--color-soft-border)'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>{job?.title}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-warm-grey)' }}>
              {job?.companyName} &bull; {job?.location} &bull; {job?.workMode}
            </p>
          </div>

          {/* Resume Selection */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Select Resume (PDF)</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-warm-grey)' }}>Max 5MB</span>
            </label>

            {resumes.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.85rem' }}>
                {resumes.map((r) => (
                  <label
                    key={r.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${selectedResumeId === r.id ? 'var(--color-deep-maroon)' : 'var(--color-soft-border)'}`,
                      backgroundColor: selectedResumeId === r.id ? 'var(--color-warm-ivory)' : 'var(--color-white)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="resumeSelect"
                      value={r.id}
                      checked={selectedResumeId === r.id}
                      onChange={() => setSelectedResumeId(r.id)}
                      style={{ accentColor: 'var(--color-deep-maroon)' }}
                    />
                    <FileText size={20} style={{ color: 'var(--color-deep-maroon)' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-dark-charcoal)' }}>{r.fileName}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey)' }}>
                        {(r.fileSizeBytes / 1024).toFixed(0)} KB &bull; Uploaded {new Date(r.uploadedAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Upload New Resume */}
            <div style={{
              border: '2px dashed var(--color-soft-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              textAlign: 'center',
              backgroundColor: 'var(--color-warm-ivory)',
              cursor: 'pointer'
            }}>
              <input
                type="file"
                id="resumeUploadInput"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
              <label htmlFor="resumeUploadInput" style={{ cursor: 'pointer', display: 'block' }}>
                <Upload size={22} style={{ color: 'var(--color-deep-maroon)', margin: '0 auto 0.4rem' }} />
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-deep-maroon)' }}>
                  {uploading ? 'Uploading resume...' : 'Upload a new PDF resume'}
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey)' }}>
                  Accepted format: PDF up to 5MB
                </span>
              </label>
            </div>
          </div>

          {/* Cover Letter / Note */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">
              Cover Note / Pitch to Recruiter (Optional)
            </label>
            <textarea
              rows="4"
              className="form-control"
              placeholder="Highlight your key achievements, why you are a great fit for this role, and your availability..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || uploading || !selectedResumeId}
            >
              {submitting ? 'Submitting Application...' : 'Confirm & Apply'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ApplyModal;
