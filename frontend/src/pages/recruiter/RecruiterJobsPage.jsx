import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recruiterService } from '../../api/recruiterService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { Briefcase, Plus, Users, Edit3, Trash2, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';

const RecruiterJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await recruiterService.getMyJobs();
      if (res.data) setJobs(res.data);
    } catch (err) {
      console.error('Failed to load recruiter jobs:', err);
      setAlert({ type: 'danger', message: 'Unable to load your job postings.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove the job posting "${title}"?`)) {
      return;
    }
    try {
      await recruiterService.deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      setAlert({ type: 'success', message: `Job "${title}" was successfully deleted.` });
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to delete job posting.' });
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <LoadingSpinner text="Retrieving your job listings..." />
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
            Job Postings Management ({jobs.length})
          </h1>
          <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.925rem' }}>
            Monitor views, review applicants, and manage your published openings
          </p>
        </div>

        <Link to="/recruiter/jobs/new" className="btn btn-primary btn-sm">
          <Plus size={16} /> Post a New Job
        </Link>
      </div>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} style={{ marginBottom: '1.5rem' }}>
          {alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{alert.message}</span>
        </div>
      )}

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No vacancies posted yet"
          description="Create your first job listing to start receiving applications from qualified candidates across India."
          action={
            <Link to="/recruiter/jobs/new" className="btn btn-primary btn-sm">
              Create Job Posting
            </Link>
          }
        />
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Job Title & Category</th>
                <th>Location & Mode</th>
                <th>Offered CTC</th>
                <th>Views</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <Link to={`/jobs/${job.id}`} style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-dark-charcoal)' }}>
                      {job.title}
                    </Link>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-warm-grey)' }}>
                      {job.category} &bull; Deadline: {job.applicationDeadline || 'Rolling'}
                    </span>
                  </td>

                  <td>
                    <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600 }}>{job.location}</span>
                    <Badge variant={job.workMode?.toLowerCase() === 'remote' ? 'green' : 'saffron'} style={{ fontSize: '0.72rem' }}>
                      {job.workMode}
                    </Badge>
                  </td>

                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--color-deep-maroon)', fontSize: '0.9rem' }}>
                      {job.salaryMax ? `₹${(job.salaryMin / 100000).toFixed(0)} - ₹${(job.salaryMax / 100000).toFixed(0)} LPA` : 'Best in Industry'}
                    </span>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-dark-charcoal)' }}>
                      {job.viewsCount || 0}
                    </span>
                  </td>

                  <td>
                    <Badge variant={job.status === 'PUBLISHED' ? 'green' : 'grey'} style={{ fontSize: '0.75rem' }}>
                      {job.status}
                    </Badge>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                      <Link
                        to={`/recruiter/applicants?jobId=${job.id}`}
                        className="btn btn-secondary btn-sm"
                        title="View Applicants"
                        style={{ padding: '0.35rem 0.65rem' }}
                      >
                        <Users size={14} /> Applicants
                      </Link>

                      <Link
                        to={`/recruiter/jobs/edit/${job.id}`}
                        className="btn btn-outline btn-sm"
                        title="Edit Job"
                        style={{ padding: '0.35rem 0.65rem' }}
                      >
                        <Edit3 size={14} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(job.id, job.title)}
                        className="btn btn-outline btn-sm"
                        title="Delete Job"
                        style={{ padding: '0.35rem 0.65rem', color: 'var(--color-error-red)', borderColor: 'var(--color-error-red)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecruiterJobsPage;
