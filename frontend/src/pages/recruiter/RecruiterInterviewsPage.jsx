import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recruiterService } from '../../api/recruiterService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { Calendar, Clock, Video, ExternalLink, User, Briefcase } from 'lucide-react';

const RecruiterInterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      setLoading(true);
      const res = await recruiterService.getInterviews();
      if (res.data) setInterviews(res.data);
    } catch (err) {
      console.error('Failed to load recruiter interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <LoadingSpinner text="Loading interview rounds..." />
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
            Scheduled Interview Rounds ({interviews.length})
          </h1>
          <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.925rem' }}>
            Monitor and conduct technical assessments and discussions with applicants
          </p>
        </div>

        <Link to="/recruiter/applicants" className="btn btn-primary btn-sm">
          Schedule New from Applicants
        </Link>
      </div>

      {interviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No interview rounds currently scheduled"
          description="Go to your Applicants Pipeline and click 'Interview' on any shortlisted candidate to schedule a technical or HR discussion."
          action={
            <Link to="/recruiter/applicants" className="btn btn-primary btn-sm">
              View Applicants
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {interviews.map((int) => (
            <div
              key={int.id}
              className="card"
              style={{
                padding: '1.75rem',
                backgroundColor: 'var(--color-white)',
                borderLeft: '4px solid var(--color-deep-maroon)'
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
                    <span className="badge badge-maroon" style={{ fontSize: '0.75rem' }}>
                      {int.interviewRound}
                    </span>
                    <Badge variant={int.status?.toLowerCase() === 'scheduled' ? 'green' : 'grey'}>
                      {int.status}
                    </Badge>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '0.25rem' }}>
                    Candidate: {int.candidateName}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-deep-maroon)', fontWeight: 600 }}>
                    Applied Role: {int.jobTitle}
                  </p>
                </div>

                {int.meetingLinkOrLocation && (
                  <a
                    href={int.meetingLinkOrLocation.startsWith('http') ? int.meetingLinkOrLocation : `https://${int.meetingLinkOrLocation}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Video size={16} /> Enter Meeting Room <ExternalLink size={14} />
                  </a>
                )}
              </div>

              {/* Timing */}
              <div style={{
                backgroundColor: 'var(--color-warm-ivory)',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2rem',
                fontSize: '0.875rem',
                color: 'var(--color-dark-charcoal)',
                marginBottom: '1rem',
                border: '1px solid var(--color-soft-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} style={{ color: 'var(--color-deep-maroon)' }} />
                  <span>
                    <strong>Date & Time:</strong>{' '}
                    {new Date(int.scheduledTime).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} style={{ color: 'var(--color-deep-maroon)' }} />
                  <span><strong>Duration:</strong> {int.durationMinutes} Minutes</span>
                </div>
              </div>

              {/* Notes */}
              {int.interviewerNotes && (
                <div style={{ fontSize: '0.875rem', color: 'var(--color-warm-grey)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--color-dark-charcoal)' }}>Candidate Instructions:</strong>{' '}
                  {int.interviewerNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterInterviewsPage;
