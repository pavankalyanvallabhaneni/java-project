import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Building2, 
  IndianRupee, 
  Briefcase, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  ArrowLeft, 
  Flag, 
  Share2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { jobService } from '../api/jobService';
import { candidateService } from '../api/candidateService';
import { useAuth } from '../context/AuthContext';
import ApplyModal from '../components/jobs/ApplyModal';
import ReportModal from '../components/jobs/ReportModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';

const formatSalary = (min, max, currency = 'INR') => {
  if (!min && !max) return 'Best in Industry';
  if (min && max) {
    const minStr = (Number(min) / 100000).toFixed(1).replace('.0', '');
    const maxStr = (Number(max) / 100000).toFixed(1).replace('.0', '');
    return `₹${minStr} - ₹${maxStr} LPA`;
  }
  if (min) return `From ₹${(Number(min) / 100000).toFixed(1).replace('.0', '')} LPA`;
  if (max) return `Up to ₹${(Number(max) / 100000).toFixed(1).replace('.0', '')} LPA`;
  return 'Competitive';
};

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isCandidate } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await jobService.getJobById(id);
        if (res.data) {
          setJob(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Job not found or no longer available');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // Check if job is saved by candidate
  useEffect(() => {
    const checkSaved = async () => {
      if (isAuthenticated && isCandidate) {
        try {
          const res = await candidateService.getSavedJobs();
          if (res.data && Array.isArray(res.data)) {
            const found = res.data.some((j) => j.id === Number(id));
            setIsSaved(found);
          }
        } catch (err) {
          console.error('Error checking saved jobs:', err);
        }
      }
    };
    checkSaved();
  }, [id, isAuthenticated, isCandidate]);

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isCandidate) return;

    try {
      setSavingBookmark(true);
      if (isSaved) {
        await candidateService.unsaveJob(id);
        setIsSaved(false);
      } else {
        await candidateService.saveJob(id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    } finally {
      setSavingBookmark(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '4rem' }}>
        <LoadingSpinner text="Loading vacancy details..." />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container" style={{ paddingTop: '3rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-dark-charcoal)' }}>
            Job Notice
          </h3>
          <p style={{ color: 'var(--color-warm-grey)', marginBottom: '1.5rem' }}>{error || 'Job not found.'}</p>
          <Link to="/jobs" className="btn btn-primary">Back to Job Listings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      {/* Back link */}
      <Link
        to="/jobs"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--color-deep-maroon)',
          marginBottom: '1.5rem'
        }}
      >
        <ArrowLeft size={16} /> Back to all jobs
      </Link>

      {/* Main Job Header Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: 'var(--color-white)' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          {/* Company info and Title */}
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            {job.companyLogoUrl ? (
              <img
                src={job.companyLogoUrl}
                alt={job.companyName}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '14px',
                  objectFit: 'cover',
                  border: '1px solid var(--color-soft-border)',
                  backgroundColor: 'var(--color-cream)',
                  flexShrink: 0
                }}
              />
            ) : (
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '14px',
                backgroundColor: 'var(--color-cream)',
                color: 'var(--color-deep-maroon)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.5rem',
                border: '1px solid var(--color-soft-border)',
                flexShrink: 0
              }}>
                {job.companyName?.charAt(0) || 'C'}
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-dark-charcoal)' }}>
                  {job.companyName}
                </span>
                {job.companyVerified && (
                  <span className="badge badge-green" style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem' }}>
                    <CheckCircle2 size={12} /> Verified Employer
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.95rem)', fontWeight: 800, color: 'var(--color-dark-charcoal)', lineHeight: 1.25, marginBottom: '0.75rem' }}>
                {job.title}
              </h1>

              {/* Meta details bar */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', color: 'var(--color-warm-grey)' }}>
                  <MapPin size={15} style={{ color: 'var(--color-deep-maroon)' }} />
                  <span>{job.location}{job.state ? `, ${job.state}` : ''}</span>
                </div>

                <Badge variant={job.workMode?.toLowerCase() === 'remote' ? 'green' : 'saffron'}>
                  {job.workMode}
                </Badge>

                <Badge variant="grey">
                  {job.employmentType}
                </Badge>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', color: 'var(--color-warm-grey)' }}>
                  <Briefcase size={15} />
                  <span>{job.minExperience}-{job.maxExperience || (job.minExperience + 3)} Yrs Experience</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '200px' }}>
            {isAuthenticated ? (
              isCandidate ? (
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => setIsApplyOpen(true)}
                  disabled={hasApplied}
                  style={{ width: '100%' }}
                >
                  {hasApplied ? 'Applied Already' : 'Apply Now'}
                </button>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-warm-grey)', backgroundColor: 'var(--color-warm-ivory)', padding: '0.6rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  Viewing in {user.role === 'ROLE_RECRUITER' ? 'Recruiter' : 'Admin'} Mode
                </div>
              )
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/login', { state: { from: `/jobs/${job.id}` } })}
                style={{ width: '100%' }}
              >
                Sign In to Apply
              </button>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(!isAuthenticated || isCandidate) && (
                <button
                  type="button"
                  onClick={handleToggleBookmark}
                  disabled={savingBookmark}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  {isSaved ? <BookmarkCheck size={16} fill="var(--color-deep-maroon)" /> : <Bookmark size={16} />}
                  <span>{isSaved ? 'Bookmarked' : 'Save'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleShare}
                className="btn btn-secondary btn-sm"
                title="Copy Job Link"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                <Share2 size={16} />
                <span>{copiedLink ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Highlight strip: Salary & Deadline */}
        <div style={{
          backgroundColor: 'var(--color-warm-ivory)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1.25rem',
          border: '1px solid var(--color-soft-border)'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-warm-grey)', display: 'block', textTransform: 'uppercase' }}>
              Offered CTC (Annual)
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-deep-maroon)' }}>
              {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-warm-grey)', display: 'block', textTransform: 'uppercase' }}>
              Open Vacancies
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-dark-charcoal)' }}>
              {job.vacancies || 1} Position{job.vacancies > 1 ? 's' : ''}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-warm-grey)', display: 'block', textTransform: 'uppercase' }}>
              Application Deadline
            </span>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
              {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Rolling Basis'}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-warm-grey)', display: 'block', textTransform: 'uppercase' }}>
              Posted On
            </span>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
              {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Main Details + Sidebar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Job Description & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--color-white)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '1rem' }}>
                Key Skills & Technologies
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      backgroundColor: 'var(--color-warm-ivory)',
                      color: 'var(--color-deep-maroon)',
                      padding: '0.35rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--color-soft-border)'
                    }}
                  >
                    {typeof skill === 'string' ? skill : skill.skillName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Role Overview */}
          <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--color-white)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '1rem' }}>
              Job Overview & Purpose
            </h3>
            <p style={{ color: 'var(--color-dark-charcoal)', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--color-white)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '1rem' }}>
                Primary Responsibilities
              </h3>
              <p style={{ color: 'var(--color-dark-charcoal)', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {job.responsibilities}
              </p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--color-white)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '1rem' }}>
                Desired Candidate Profile & Qualifications
              </h3>
              <p style={{ color: 'var(--color-dark-charcoal)', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {job.requirements}
              </p>
            </div>
          )}

          {/* Report Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) navigate('/login');
                else setIsReportOpen(true);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-warm-grey)',
                fontSize: '0.825rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Flag size={14} /> Report this job posting
            </button>
          </div>
        </div>

        {/* Right Column: Company Info Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Company Card */}
          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--color-white)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '1rem', borderBottom: '1px solid var(--color-soft-border)', paddingBottom: '0.65rem' }}>
              About {job.companyName}
            </h3>

            {job.companyDescription && (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-warm-grey)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {job.companyDescription}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-dark-charcoal)' }}>
                <Building2 size={16} style={{ color: 'var(--color-deep-maroon)' }} />
                <span>Industry: <strong>{job.category || 'Information Technology'}</strong></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-dark-charcoal)' }}>
                <MapPin size={16} style={{ color: 'var(--color-deep-maroon)' }} />
                <span>Location: <strong>{job.location}</strong></span>
              </div>

              {job.companyWebsite && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-dark-charcoal)', marginTop: '0.25rem' }}>
                  <ExternalLink size={16} style={{ color: 'var(--color-deep-maroon)' }} />
                  <a
                    href={job.companyWebsite.startsWith('http') ? job.companyWebsite : `https://${job.companyWebsite}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--color-deep-maroon)', fontWeight: 600 }}
                  >
                    Visit Company Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Safety & Trust Box */}
          <div style={{
            backgroundColor: 'var(--color-warm-ivory)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            border: '1px solid var(--color-soft-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem', color: 'var(--color-deep-maroon)' }}>
              <ShieldCheck size={20} />
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700 }}>BharatHire Safe Hiring Guarantee</h4>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--color-warm-grey)', lineHeight: 1.5 }}>
              BharatHire never charges candidates any fees for job applications, screening, or interview scheduling. If an employer requests money, report them immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {isApplyOpen && (
        <ApplyModal
          isOpen={isApplyOpen}
          onClose={() => setIsApplyOpen(false)}
          job={job}
          onApplied={() => setHasApplied(true)}
        />
      )}

      {/* Report Modal */}
      {isReportOpen && (
        <ReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          jobId={job.id}
          jobTitle={job.title}
        />
      )}
    </div>
  );
};

export default JobDetailsPage;
