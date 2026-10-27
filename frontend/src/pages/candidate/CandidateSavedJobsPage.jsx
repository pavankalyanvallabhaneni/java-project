import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { candidateService } from '../../api/candidateService';
import JobCard from '../../components/jobs/JobCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Bookmark, ArrowRight } from 'lucide-react';

const CandidateSavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await candidateService.getSavedJobs();
      if (res.data) setSavedJobs(res.data);
    } catch (err) {
      console.error('Failed to load saved jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = (jobId) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <LoadingSpinner text="Loading bookmarked jobs..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-dark-charcoal)', marginBottom: '0.25rem' }}>
            Bookmarked Jobs ({savedJobs.length})
          </h1>
          <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.925rem' }}>
            Positions you have pinned for review and application
          </p>
        </div>

        <Link to="/jobs" className="btn btn-primary btn-sm">
          Discover More Openings
        </Link>
      </div>

      {savedJobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarked vacancies"
          description="When you find a vacancy you're interested in, click the bookmark icon on any job card to save it here for later."
          action={
            <Link to="/jobs" className="btn btn-primary btn-sm">
              Search Jobs
            </Link>
          }
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={true}
              onSaveToggle={(id, saved) => {
                if (!saved) handleUnsave(id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateSavedJobsPage;
