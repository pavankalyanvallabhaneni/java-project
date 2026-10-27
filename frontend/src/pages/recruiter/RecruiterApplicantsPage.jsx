import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { applicationService } from '../../api/applicationService';
import { recruiterService } from '../../api/recruiterService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { 
  Users, 
  FileText, 
  Download, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Eye, 
  Mail, 
  Phone,
  Video,
  ArrowRight
} from 'lucide-react';

const RecruiterApplicantsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedJobId = searchParams.get('jobId') || '';

  const [applications, setApplications] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [filterJobId, setFilterJobId] = useState(selectedJobId);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Status Update Modal State
  const [statusModalApp, setStatusModalApp] = useState(null);
  const [newStatus, setNewStatus] = useState('Shortlisted');
  const [statusComments, setStatusComments] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Schedule Interview Modal State
  const [interviewModalApp, setInterviewModalApp] = useState(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [interviewRound, setInterviewRound] = useState('Technical Round 1');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/abc-defg-hij');
  const [interviewerNotes, setInterviewerNotes] = useState('');
  const [schedulingInterview, setSchedulingInterview] = useState(false);

  // Candidate Details Modal
  const [detailsModalApp, setDetailsModalApp] = useState(null);

  useEffect(() => {
    loadData();
  }, [filterJobId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes] = await Promise.all([
        recruiterService.getMyJobs(),
        filterJobId
          ? applicationService.getJobApplicants(filterJobId)
          : applicationService.getRecruiterApplications(),
      ]);

      if (jobsRes.data) setMyJobs(jobsRes.data);
      if (appsRes.data) setApplications(appsRes.data);
    } catch (err) {
      console.error('Failed to load recruiter applicants:', err);
      setAlert({ type: 'danger', message: 'Unable to retrieve applicants list.' });
    } finally {
      setLoading(false);
    }
  };

  const handleJobFilterChange = (e) => {
    const val = e.target.value;
    setFilterJobId(val);
    if (val) setSearchParams({ jobId: val });
    else setSearchParams({});
  };

  const handleDownloadResume = async (resumeId, candidateName) => {
    if (!resumeId) {
      setAlert({ type: 'danger', message: 'No resume attached to this application.' });
      return;
    }
    try {
      const blob = await applicationService.downloadResume(resumeId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${candidateName.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download resume:', err);
      setAlert({ type: 'danger', message: 'Could not download PDF resume.' });
    }
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!statusModalApp) return;

    try {
      setUpdatingStatus(true);
      const res = await applicationService.updateStatus(statusModalApp.id, {
        newStatus,
        comments: statusComments,
      });

      if (res.data) {
        setApplications((prev) =>
          prev.map((a) => (a.id === statusModalApp.id ? res.data : a))
        );
        setAlert({ type: 'success', message: `Applicant status updated to "${newStatus}".` });
      }
      setStatusModalApp(null);
      setStatusComments('');
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to update status.' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleScheduleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!interviewModalApp || !scheduledTime || !meetingLink) {
      setAlert({ type: 'danger', message: 'Please provide the meeting time and video link.' });
      return;
    }

    try {
      setSchedulingInterview(true);
      await recruiterService.scheduleInterview({
        applicationId: interviewModalApp.id,
        scheduledTime,
        durationMinutes: Number(durationMinutes) || 45,
        interviewRound,
        meetingLinkOrLocation: meetingLink,
        interviewerNotes,
      });

      // Update application status locally to 'Interview Scheduled'
      setApplications((prev) =>
        prev.map((a) => (a.id === interviewModalApp.id ? { ...a, currentStatus: 'Interview Scheduled' } : a))
      );

      setAlert({ type: 'success', message: `Interview round scheduled for ${interviewModalApp.candidateName}.` });
      setInterviewModalApp(null);
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to schedule interview.' });
    } finally {
      setSchedulingInterview(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'ALL') return true;
    return app.currentStatus.toUpperCase() === statusFilter;
  });

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <LoadingSpinner text="Loading applicant roster..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      {/* Header */}
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
            Applicants & Pipeline Review ({applications.length})
          </h1>
          <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.925rem' }}>
            Review candidate profiles, download resumes, update screening stages, and schedule interviews
          </p>
        </div>

        {/* Job selector filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <select
            className="form-select"
            value={filterJobId}
            onChange={handleJobFilterChange}
            style={{ width: 'auto', minWidth: '240px' }}
          >
            <option value="">All Job Openings ({applications.length})</option>
            {myJobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>
      </div>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} style={{ marginBottom: '1.5rem' }}>
          {alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Stage Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        borderBottom: '1px solid var(--color-soft-border)',
        paddingBottom: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        {[
          { label: 'All Candidates', value: 'ALL' },
          { label: 'Applied', value: 'APPLIED' },
          { label: 'Under Review', value: 'UNDER REVIEW' },
          { label: 'Shortlisted', value: 'SHORTLISTED' },
          { label: 'Interview Scheduled', value: 'INTERVIEW SCHEDULED' },
          { label: 'Selected', value: 'SELECTED' },
          { label: 'Rejected', value: 'REJECTED' },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`btn btn-sm ${statusFilter === tab.value ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter(tab.value)}
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredApps.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applicants found in this view"
          description="Candidates will appear here as soon as they submit applications for your published openings."
        />
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Candidate Details</th>
                <th>Target Role</th>
                <th>Applied Date</th>
                <th>Resume</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-warm-ivory)',
                        color: 'var(--color-deep-maroon)',
                        border: '1px solid var(--color-soft-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.95rem'
                      }}>
                        {app.candidateName?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-dark-charcoal)', display: 'block' }}>
                          {app.candidateName}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-warm-grey)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={12} /> {app.candidateEmail}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-dark-charcoal)' }}>
                      {app.jobTitle}
                    </span>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-dark-charcoal)' }}>
                      {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>

                  <td>
                    {app.resumeId ? (
                      <button
                        type="button"
                        onClick={() => handleDownloadResume(app.resumeId, app.candidateName)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Download size={13} /> Download PDF
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-warm-grey)' }}>No file</span>
                    )}
                  </td>

                  <td>
                    <span className={`badge status-${app.currentStatus?.toLowerCase().replace(/\s+/g, '-')}`} style={{ fontSize: '0.78rem' }}>
                      {app.currentStatus}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setDetailsModalApp(app)}
                        title="View Full Profile & Notes"
                        style={{ padding: '0.35rem 0.65rem' }}
                      >
                        <Eye size={14} /> View
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setStatusModalApp(app);
                          setNewStatus(app.currentStatus);
                        }}
                        title="Change Candidate Status"
                        style={{ padding: '0.35rem 0.65rem' }}
                      >
                        <Edit3 size={14} /> Stage
                      </button>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setInterviewModalApp(app);
                          setScheduledTime(new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16));
                        }}
                        title="Schedule Interview Round"
                        style={{ padding: '0.35rem 0.65rem' }}
                      >
                        <Calendar size={14} /> Interview
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Candidate Profile & Timeline Modal */}
      {detailsModalApp && (
        <Modal
          isOpen={!!detailsModalApp}
          onClose={() => setDetailsModalApp(null)}
          title={`Candidate Profile: ${detailsModalApp.candidateName}`}
          maxWidth="600px"
        >
          <div>
            <div style={{
              backgroundColor: 'var(--color-warm-ivory)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-soft-border)',
              marginBottom: '1.25rem'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-dark-charcoal)' }}>
                {detailsModalApp.candidateName}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-deep-maroon)', fontWeight: 600, marginTop: '2px' }}>
                Applied for: {detailsModalApp.jobTitle}
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.825rem', color: 'var(--color-warm-grey)' }}>
                <span>Email: {detailsModalApp.candidateEmail}</span>
                {detailsModalApp.candidatePhone && <span>Phone: {detailsModalApp.candidatePhone}</span>}
              </div>
            </div>

            {detailsModalApp.coverLetter && (
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '0.35rem' }}>
                  Cover Note / Pitch:
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-dark-charcoal)', backgroundColor: 'var(--color-white)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-soft-border)', lineHeight: 1.5 }}>
                  {detailsModalApp.coverLetter}
                </p>
              </div>
            )}

            {/* Status History */}
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '0.75rem' }}>
              Stage History
            </h4>
            {(!detailsModalApp.statusHistory || detailsModalApp.statusHistory.length === 0) ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-warm-grey)' }}>Initial submission on {new Date(detailsModalApp.appliedAt).toLocaleDateString('en-IN')}.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderLeft: '2px solid var(--color-deep-maroon)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
                {detailsModalApp.statusHistory.map((h, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{h.newStatus}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey)' }}>
                        {new Date(h.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    {h.comments && <p style={{ fontSize: '0.8rem', color: 'var(--color-warm-grey)' }}>{h.comments}</p>}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.75rem' }}>
              {detailsModalApp.resumeId && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleDownloadResume(detailsModalApp.resumeId, detailsModalApp.candidateName)}
                >
                  <Download size={14} /> Download Resume
                </button>
              )}
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setDetailsModalApp(null)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Change Status Modal */}
      {statusModalApp && (
        <Modal
          isOpen={!!statusModalApp}
          onClose={() => setStatusModalApp(null)}
          title={`Update Status: ${statusModalApp.candidateName}`}
          maxWidth="480px"
        >
          <form onSubmit={handleUpdateStatusSubmit}>
            <div className="form-group">
              <label className="form-label">New Screening Stage</label>
              <select
                className="form-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Selected">Selected / Offer Extended</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Recruiter Feedback / Notes (Visible to candidate timeline)</label>
              <textarea
                rows="3"
                className="form-control"
                placeholder="e.g. Cleared resume screening, advancing to technical coding round..."
                value={statusComments}
                onChange={(e) => setStatusComments(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setStatusModalApp(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={updatingStatus}>
                {updatingStatus ? 'Updating...' : 'Save Status'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Schedule Interview Modal */}
      {interviewModalApp && (
        <Modal
          isOpen={!!interviewModalApp}
          onClose={() => setInterviewModalApp(null)}
          title={`Schedule Interview: ${interviewModalApp.candidateName}`}
          maxWidth="520px"
        >
          <form onSubmit={handleScheduleInterviewSubmit}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-warm-grey)', marginBottom: '1rem' }}>
              Role: <strong>{interviewModalApp.jobTitle}</strong>
            </p>

            <div className="form-group">
              <label className="form-label">Interview Round *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Technical Round 1 - Java & Data Structures"
                value={interviewRound}
                onChange={(e) => setInterviewRound(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Date & Time *</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration (Mins)</label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  className="form-control"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Meeting URL / Google Meet Link *</label>
              <input
                type="text"
                className="form-control"
                placeholder="https://meet.google.com/xxx-yyyy-zzz"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Agenda & Instructions for Candidate</label>
              <textarea
                rows="3"
                className="form-control"
                placeholder="Please be ready with your IDE and GitHub repositories..."
                value={interviewerNotes}
                onChange={(e) => setInterviewerNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setInterviewModalApp(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={schedulingInterview}>
                {schedulingInterview ? 'Scheduling...' : 'Confirm & Schedule Round'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RecruiterApplicantsPage;
