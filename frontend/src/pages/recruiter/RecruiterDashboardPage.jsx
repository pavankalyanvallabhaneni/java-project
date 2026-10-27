import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  PlusCircle, 
  TrendingUp, 
  Building2,
  FileText,
  ArrowRight,
  Eye
} from 'lucide-react';
import { recruiterService } from '../../api/recruiterService';
import { applicationService } from '../../api/applicationService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';

const RecruiterDashboardPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecruiterData();
  }, []);

  const loadRecruiterData = async () => {
    try {
      setLoading(true);
      const [profRes, anaRes, appsRes, jobsRes] = await Promise.all([
        recruiterService.getProfile(),
        recruiterService.getAnalytics(),
        applicationService.getRecruiterApplications(),
        recruiterService.getMyJobs(),
      ]);

      if (profRes.data) setProfile(profRes.data);
      if (anaRes.data) setAnalytics(anaRes.data);
      if (appsRes.data) setRecentApplications(appsRes.data.slice(0, 6));
      if (jobsRes.data) setMyJobs(jobsRes.data);
    } catch (err) {
      console.error('Failed to load recruiter dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <LoadingSpinner text="Loading recruiter command center..." />
      </div>
    );
  }

  const activeJobsCount = myJobs.filter((j) => j.status === 'PUBLISHED').length;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--color-cream)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem 2.25rem',
        border: '1px solid var(--color-soft-border)',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {profile?.companyLogoUrl ? (
            <img
              src={profile.companyLogoUrl}
              alt={profile.companyName}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '14px',
                objectFit: 'cover',
                border: '1px solid var(--color-soft-border)',
                backgroundColor: 'var(--color-white)'
              }}
            />
          ) : (
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '14px',
              backgroundColor: 'var(--color-deep-maroon)',
              color: 'var(--color-saffron)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.5rem'
            }}>
              {profile?.companyName?.charAt(0) || 'E'}
            </div>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-deep-maroon)', textTransform: 'uppercase' }}>
                Employer Command Center
              </span>
              {profile?.isVerified && (
                <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                  <CheckCircle2 size={12} /> Verified Enterprise
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-dark-charcoal)', marginBottom: '0.2rem' }}>
              {profile?.companyName || 'Your Organization'}
            </h1>
            <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.9rem' }}>
              Logged in as <strong>{user?.fullName}</strong> &bull; {profile?.designation || 'Talent Acquisition Partner'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/recruiter/company" className="btn btn-secondary btn-sm">
            <Building2 size={16} /> Company Details
          </Link>
          <Link to="/recruiter/jobs/new" className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> Post New Vacancy
          </Link>
        </div>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-warm-grey)' }}>Active Jobs</span>
            <Briefcase size={20} style={{ color: 'var(--color-deep-maroon)' }} />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-dark-charcoal)' }}>
            {activeJobsCount}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey)', display: 'block', marginTop: '2px' }}>
            {myJobs.length} total postings
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-warm-grey)' }}>Total Applicants</span>
            <Users size={20} style={{ color: 'var(--color-saffron-dark)' }} />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-dark-charcoal)' }}>
            {analytics?.totalApplications || 0}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey)', display: 'block', marginTop: '2px' }}>
            Across all active postings
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-warm-grey)' }}>Under Review</span>
            <Clock size={20} style={{ color: 'var(--color-warm-grey)' }} />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-dark-charcoal)' }}>
            {analytics?.underReview || 0}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey)', display: 'block', marginTop: '2px' }}>
            Awaiting screening
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-warm-grey)' }}>Shortlisted</span>
            <CheckCircle2 size={20} style={{ color: 'var(--color-muted-green)' }} />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-dark-charcoal)' }}>
            {analytics?.shortlisted || 0}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey)', display: 'block', marginTop: '2px' }}>
            Qualified candidates
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-warm-grey)' }}>Interviews</span>
            <Calendar size={20} style={{ color: 'var(--color-burgundy)' }} />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-dark-charcoal)' }}>
            {analytics?.interviewsScheduled || 0}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey)', display: 'block', marginTop: '2px' }}>
            Rounds scheduled
          </span>
        </div>
      </div>

      {/* Grid: My Postings & Recent Candidate Applications */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {/* Recent Applications Pipeline */}
        <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--color-white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
                Candidate Pipeline
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--color-warm-grey)' }}>
                Latest submissions needing review or interview rounds
              </p>
            </div>
            <Link to="/recruiter/applicants" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-deep-maroon)' }}>
              Manage All
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--color-warm-grey)' }}>
              <Users size={32} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.9rem' }}>No applicants received yet.</p>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-warm-grey-light)' }}>
                Once you post vacancies, applicants will show up here.
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  style={{
                    padding: '0.9rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-soft-border)',
                    backgroundColor: 'var(--color-warm-ivory)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
                      {app.candidateName}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-warm-grey)' }}>
                      Applied for: <strong>{app.jobTitle}</strong>
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey-light)' }}>
                      {new Date(app.appliedAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className={`badge status-${app.currentStatus?.toLowerCase().replace(/\s+/g, '-')}`} style={{ fontSize: '0.78rem' }}>
                      {app.currentStatus}
                    </span>
                    <Link to="/recruiter/applicants" className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
                      <Eye size={14} /> Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Jobs List Preview */}
        <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--color-white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
                Your Active Postings
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--color-warm-grey)' }}>
                Live openings published on BharatHire
              </p>
            </div>
            <Link to="/recruiter/jobs" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-deep-maroon)' }}>
              All Jobs ({myJobs.length})
            </Link>
          </div>

          {myJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--color-warm-grey)' }}>
              <Briefcase size={32} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>No jobs posted yet.</p>
              <Link to="/recruiter/jobs/new" className="btn btn-primary btn-sm">Post Your First Job</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {myJobs.slice(0, 5).map((job) => (
                <div
                  key={job.id}
                  style={{
                    padding: '0.9rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-soft-border)',
                    backgroundColor: 'var(--color-warm-ivory)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
                      {job.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-warm-grey)' }}>
                      {job.location} &bull; {job.workMode} &bull; {job.vacancies} Vacanc{job.vacancies > 1 ? 'ies' : 'y'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-maroon" style={{ fontSize: '0.75rem' }}>
                      {job.viewsCount || 0} views
                    </span>
                    <Link to={`/recruiter/jobs/edit/${job.id}`} className="btn btn-outline btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboardPage;
