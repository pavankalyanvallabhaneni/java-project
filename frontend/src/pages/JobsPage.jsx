import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobService } from '../api/jobService';
import JobCard from '../components/jobs/JobCard';
import JobFilter from '../components/jobs/JobFilter';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { Briefcase, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // Parse filters from URL
  const filters = {
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    workMode: searchParams.get('workMode') || '',
    employmentType: searchParams.get('employmentType') || '',
    page: parseInt(searchParams.get('page') || '0', 10),
    size: 10,
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortDir: searchParams.get('sortDir') || 'desc',
  };

  const updateFilters = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key] !== '' && newFilters[key] !== null && newFilters[key] !== undefined) {
        params.set(key, newFilters[key]);
      }
    });
    setSearchParams(params);
  };

  const loadCategories = async () => {
    try {
      const res = await jobService.getCategories();
      if (res.data) setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await jobService.searchJobs({
        keyword: filters.keyword,
        category: filters.category,
        location: filters.location,
        workMode: filters.workMode,
        employmentType: filters.employmentType,
        page: filters.page,
        size: filters.size,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
      });

      if (res.data) {
        setJobs(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [
    filters.keyword,
    filters.location,
    filters.category,
    filters.workMode,
    filters.employmentType,
    filters.page,
    filters.size,
    filters.sortBy,
    filters.sortDir,
  ]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleFilterChange = (updated) => {
    updateFilters({ ...updated, page: 0 });
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const handleSortChange = (e) => {
    const [sortBy, sortDir] = e.target.value.split('-');
    updateFilters({ ...filters, sortBy, sortDir, page: 0 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      updateFilters({ ...filters, page: newPage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Title & Count Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-dark-charcoal)', marginBottom: '0.25rem' }}>
            Explore Verified Job Opportunities
          </h1>
          <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.925rem' }}>
            Showing {totalElements} matching Indian tech and enterprise openings
          </p>
        </div>

        {/* Sort Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowUpDown size={16} style={{ color: 'var(--color-warm-grey)' }} />
          <select
            className="form-select"
            value={`${filters.sortBy}-${filters.sortDir}`}
            onChange={handleSortChange}
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="salaryMax-desc">Highest Salary (LPA)</option>
            <option value="minExperience-asc">Lowest Experience</option>
          </select>
        </div>
      </div>

      {/* Filter Bar */}
      <JobFilter
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        categories={categories}
      />

      {/* Results List */}
      {loading ? (
        <LoadingSpinner text="Searching jobs..." />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No jobs found matching your filters"
          description="Try broadening your search term, selecting a different city, or removing filters."
          action={
            <button type="button" onClick={handleResetFilters} className="btn btn-secondary btn-sm">
              Clear All Filters
            </button>
          }
        />
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}>
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '2rem'
            }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 0}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-dark-charcoal)', padding: '0 0.5rem' }}>
                Page {filters.page + 1} of {totalPages}
              </span>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= totalPages - 1}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobsPage;
