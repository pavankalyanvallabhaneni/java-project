import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2, IndianRupee, Briefcase, Bookmark, BookmarkCheck, CheckCircle2, Clock } from 'lucide-react';
import { candidateService } from '../../api/candidateService';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';

const formatSalary = (min, max, currency = 'INR') => {
  if (!min && !max) return 'Best in Industry';
  const formatInLakhs = (val) => {
    if (!val) return '';
    const num = Number(val);
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1).replace('.0', '')} LPA`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  };

  if (min && max) {
    const minStr = (Number(min) / 100000).toFixed(1).replace('.0', '');
    const maxStr = (Number(max) / 100000).toFixed(1).replace('.0', '');
    return `₹${minStr} - ₹${maxStr} LPA`;
  }
  if (min) return `From ${formatInLakhs(min)}`;
  if (max) return `Up to ${formatInLakhs(max)}`;
  return 'Competitive';
};

const JobCard = ({ job, isSaved = false, onSaveToggle }) => {
  const { isAuthenticated, isCandidate } = useAuth();
  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated || !isCandidate) return;

    try {
      setSaving(true);
      if (saved) {
        await candidateService.unsaveJob(job.id);
        setSaved(false);
        if (onSaveToggle) onSaveToggle(job.id, false);
      } else {
        await candidateService.saveJob(job.id);
        setSaved(true);
        if (onSaveToggle) onSaveToggle(job.id, true);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    } finally {
      setSaving(false);
    }
  };

  const getWorkModeVariant = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'remote': return 'green';
      case 'hybrid': return 'saffron';
      default: return 'grey';
    }
  };

  return (
    <div
      className="card card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'all 0.25s ease',
        cursor: 'pointer'
      }}
    >
      <div>
        {/* Top Header: Company logo & Bookmark */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {job.companyLogoUrl ? (
              <img
                src={job.companyLogoUrl}
                alt={job.companyName}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  border: '1px solid var(--color-soft-border)',
                  backgroundColor: 'var(--color-cream)'
                }}
              />
            ) : (
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-cream)',
                color: 'var(--color-deep-maroon)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.1rem',
                border: '1px solid var(--color-soft-border)'
              }}>
                {job.companyName?.charAt(0) || 'C'}
              </div>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-dark-charcoal)' }}>
                  {job.companyName}
                </span>
                {job.companyVerified && (
                  <CheckCircle2 size={15} style={{ color: 'var(--color-muted-green)', fill: 'rgba(71, 118, 83, 0.15)' }} title="Verified Employer" />
                )}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-warm-grey)' }}>
                {job.category}
              </span>
            </div>
          </div>

          {/* Bookmark Button (Only for candidates or guests) */}
          {(!isAuthenticated || isCandidate) && (
            <button
              type="button"
              onClick={handleBookmark}
              disabled={saving}
              title={saved ? 'Remove Bookmark' : 'Save Job'}
              style={{
                background: 'none',
                border: 'none',
                color: saved ? 'var(--color-deep-maroon)' : 'var(--color-warm-grey-light)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.15s'
              }}
            >
              {saved ? <BookmarkCheck size={22} fill="var(--color-deep-maroon)" /> : <Bookmark size={22} />}
            </button>
          )}
        </div>

        {/* Job Title */}
        <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: '1.18rem',
            fontWeight: 700,
            color: 'var(--color-dark-charcoal)',
            marginBottom: '0.6rem',
            lineHeight: 1.3
          }}>
            {job.title}
          </h3>
        </Link>

        {/* Meta badges: Location, Work Mode, Exp, Salary */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.825rem', color: 'var(--color-warm-grey)' }}>
            <MapPin size={14} style={{ color: 'var(--color-deep-maroon)' }} />
            <span>{job.location}{job.state ? `, ${job.state}` : ''}</span>
          </div>

          <Badge variant={getWorkModeVariant(job.workMode)} style={{ fontSize: '0.75rem' }}>
            {job.workMode}
          </Badge>

          <Badge variant="grey" style={{ fontSize: '0.75rem' }}>
            {job.employmentType}
          </Badge>

          {job.minExperience !== undefined && (
            <Badge variant="grey" style={{ fontSize: '0.75rem' }}>
              {job.minExperience}-{job.maxExperience || (job.minExperience + 3)} Yrs
            </Badge>
          )}
        </div>

        {/* Short Description */}
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--color-warm-grey)',
          lineHeight: 1.5,
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {job.description}
        </p>

        {/* Skills Pills */}
        {job.skills && job.skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: 'var(--color-warm-ivory)',
                  color: 'var(--color-deep-maroon)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-soft-border)',
                  fontWeight: 600
                }}
              >
                {typeof skill === 'string' ? skill : skill.skillName}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-warm-grey)', alignSelf: 'center' }}>
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Salary & View button */}
      <div style={{
        borderTop: '1px solid var(--color-soft-border)',
        paddingTop: '0.85rem',
        marginTop: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-deep-maroon)' }}>
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
          </span>
        </div>

        <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
