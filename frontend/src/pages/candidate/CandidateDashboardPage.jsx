import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Send, 
  Calendar, 
  Bookmark, 
  User, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Building2
} from 'lucide-react';
import { applicationService } from '../../api/applicationService';
import { candidateService } from '../../api/candidateService';
import { jobService } from '../../api/jobService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';

const CandidateDashboardPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [profRes, appsRes, savedRes, intRes, featRes] = await Promise.all([
          candidateService.getProfile(),
          applicationService.getCandidateApplications(),
          candidateService.getSavedJobs(),
          candidateService.getInterviews(),
          jobService.getFeaturedJobs(),
        ]);

        if (profRes.data) setProfile(profRes.data);
        if (appsRes.data) setApplications(appsRes.data);
        if (savedRes.data) setSavedJobs(savedRes.data);
        if (intRes.data) setInterviews(intRes.data);
        if (featRes.data) setRecommendedJobs(featRes.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load candidate dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <LoadingSpinner text="Loading candidate overview..." />
      </div>
    );
  }

  const activeAppsCount = applications.filter((a) => a.currentStatus !== 'Rejected' && a.currentStatus !== 'Withdrawn').length;
  const interviewCount = interviews.length;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      {/* Welcome Banner */}
      <div style={{
        backgroundColor: 'var(--color-warm-ivory)',
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
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-saffron-dark)', textTransform: 'uppercase' }}>
            Job Seeker Hub
          </span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-dark-charcoal)', marginTop: '2px', marginBottom: '0.4rem' }}>
            Namaste, {user?.fullName}!
          </h1>
          <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.95rem', maxWidth: '600px' }}>
            {profile?.headline || 'Explore open positions and track your application milestones with top Indian employers.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/candidate/profile" className="btn btn-secondary btn-sm">
            <User size={16} /> Edit Profile
          </Link>
          <Link to="/jobs" className="btn btn-primary btn-sm">
            <Briefcase size={16} /> Find Jobs
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-warm-ivory)', color: 'var(--color-deep-maroon)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Send size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark-charcoal)', display: 'block', lineHeight: 1.1 }}>
              {applications.length}
            </span>
            <span style={{ fontSize: '0.825rem', color: 'var(--color-warm-grey)', fontWeight: 600 }}>Total Applications</span>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-saffron-light)', color: 'var(--color-saffron-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark-charcoal)', display: 'block', lineHeight: 1.1 }}>
              {activeAppsCount}
            </span>
            <span style={{ fontSize: '0.825rem', color: 'var(--color-warm-grey)', fontWeight: 600 }}>In Active Pipeline</span>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-muted-green-light)', color: 'var(--color-muted-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark-charcoal)', display: 'block', lineHeight: 1.1 }}>
              {interviewCount}
            </span>
            <span style={{ fontSize: '0.825rem', color: 'var(--color-warm-grey)', fontWeight: 600 }}>Interviews Scheduled</span>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-cream)', color: 'var(--color-burgundy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bookmark size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark-charcoal)', display: 'block', lineHeight: 1.1 }}>
              {savedJobs.length}
            </span>
            <span style={{ fontSize: '0.825rem', color: 'var(--color-warm-grey)', fontWeight: 600 }}>Bookmarked Jobs</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Applications & Upcoming Interviews */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        marginBottom: '2.5rem'
      }}>
        {/* Recent Applications */}
        <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--color-white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
              Recent Applications
            </h3>
            <Link to="/candidate/applications" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-deep-maroon)' }}>
              View All ({applications.length})
            </Link>
          </div>

          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-warm-grey)' }}>
              <Send size={32} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>You haven't applied to any jobs yet.</p>
              <Link to="/jobs" className="btn btn-outline btn-sm">Explore Openings</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {applications.slice(0, 4).map((app) => (
                <div
                  key={app.id}
                  style={{
                    padding: '0.85rem 1rem',
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
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '2px' }}>
                      {app.jobTitle}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-warm-grey)' }}>
                      {app.companyName} &bull; Applied {new Date(app.appliedAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  <span className={`badge status-${app.currentStatus?.toLowerCase().replace(/\s+/g, '-')}`} style={{ fontSize: '0.78rem' }}>
                    {app.currentStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scheduled Interviews */}
        <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--color-white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
              Scheduled Interviews
            </h3>
            <Link to="/candidate/interviews" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-deep-maroon)' }}>
              All Interviews ({interviews.length})
            </Link>
          </div>

          {interviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-warm-grey)' }}>
              <Calendar size={32} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.9rem' }}>No upcoming interviews scheduled yet.</p>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-warm-grey-light)' }}>
                Recruiters will schedule rounds once your resume is shortlisted.
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {interviews.slice(0, 3).map((int) => (
                <div
                  key={int.id}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #C8E3CF',
                    backgroundColor: 'var(--color-muted-green-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-muted-green)' }}>
                        {int.interviewRound}
                      </h4>
                      <p style={{ fontSize: '0.825rem', color: 'var(--color-dark-charcoal)' }}>
                        {int.jobTitle} &bull; {int.companyName}
                      </p>
                    </div>
                    <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                      {int.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--color-warm-grey)' }}>
                    <span>
                      {new Date(int.scheduledTime).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })} ({int.durationMinutes} mins)
                    </span>

                    {int.meetingLinkOrLocation && (
                      <a
                        href={int.meetingLinkOrLocation.startsWith('http') ? int.meetingLinkOrLocation : `https://${int.meetingLinkOrLocation}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--color-deep-maroon)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                      >
                        Join Meeting <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommended Jobs */}
      {recommendedJobs.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-dark-charcoal)' }}>
              Recommended Openings for You
            </h3>
            <Link to="/jobs" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-deep-maroon)' }}>
              Explore All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem'
          }}>
            {recommendedJobs.map((job) => (
              <div key={job.id} className="card card-hover" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-warm-grey)', fontWeight: 600 }}>{job.companyName}</span>
                  <Badge variant={job.workMode?.toLowerCase() === 'remote' ? 'green' : 'saffron'} style={{ fontSize: '0.72rem' }}>
                    {job.workMode}
                  </Badge>
                </div>
                <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '0.5rem' }}>
                    {job.title}
                  </h4>
                </Link>
                <p style={{ fontSize: '0.825rem', color: 'var(--color-warm-grey)', marginBottom: '0.75rem' }}>
                  {job.location} &bull; {job.minExperience}+ yrs exp
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-soft-border)', paddingTop: '0.75rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-deep-maroon)', fontSize: '0.9rem' }}>
                    {job.salaryMax ? `Up to ₹${(job.salaryMax / 100000).toFixed(0)} LPA` : 'Best in Industry'}
                  </span>
                  <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">
                    View Job
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboardPage;
