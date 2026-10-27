import React from 'react';
import { Search, MapPin, Briefcase, Filter, X } from 'lucide-react';

const JobFilter = ({ filters, onChange, onReset, categories = [] }) => {
  const handleInputChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  const workModes = ['Remote', 'Hybrid', 'On-site'];
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', backgroundColor: 'var(--color-white)' }}>
      {/* Search Bar Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.85rem',
        marginBottom: '1rem'
      }}>
        {/* Keyword input */}
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-grey)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Role, skill, or keyword..."
            value={filters.keyword || ''}
            onChange={(e) => handleInputChange('keyword', e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>

        {/* Location input */}
        <div style={{ position: 'relative' }}>
          <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-grey)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="City (e.g. Bengaluru, Pune)..."
            value={filters.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>

        {/* Category dropdown */}
        <div>
          <select
            className="form-select"
            value={filters.category || ''}
            onChange={(e) => handleInputChange('category', e.target.value)}
          >
            <option value="">All Job Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Badges Row: Work Mode & Employment Type */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        borderTop: '1px solid var(--color-soft-border)',
        paddingTop: '0.85rem'
      }}>
        {/* Work mode pills */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-warm-grey)', marginRight: '4px' }}>
            Work Mode:
          </span>
          <button
            type="button"
            className={`btn btn-sm ${!filters.workMode ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleInputChange('workMode', '')}
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.8rem' }}
          >
            All
          </button>
          {workModes.map((mode) => (
            <button
              key={mode}
              type="button"
              className={`btn btn-sm ${filters.workMode === mode ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleInputChange('workMode', filters.workMode === mode ? '' : mode)}
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.8rem' }}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Employment Type dropdown and Reset button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select
            className="form-select"
            value={filters.employmentType || ''}
            onChange={(e) => handleInputChange('employmentType', e.target.value)}
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.825rem', width: 'auto' }}
          >
            <option value="">All Employment Types</option>
            {employmentTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {(filters.keyword || filters.location || filters.category || filters.workMode || filters.employmentType) && (
            <button
              type="button"
              onClick={onReset}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobFilter;
