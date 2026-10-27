import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recruiterService } from '../../api/recruiterService';
import { jobService } from '../../api/jobService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Briefcase, ArrowLeft, Plus, X, AlertCircle, CheckCircle2 } from 'lucide-react';

const RecruiterPostJobPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('IT & Software');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [minExperience, setMinExperience] = useState(2);
  const [maxExperience, setMaxExperience] = useState(5);
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [workMode, setWorkMode] = useState('Hybrid');
  const [location, setLocation] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [salaryMin, setSalaryMin] = useState('1200000');
  const [salaryMax, setSalaryMax] = useState('1800000');
  const [salaryCurrency, setSalaryCurrency] = useState('INR');
  const [vacancies, setVacancies] = useState(2);
  const [applicationDeadline, setApplicationDeadline] = useState('');
  
  // Skills
  const [skills, setSkills] = useState(['Java', 'Spring Boot', 'React']);
  const [skillInput, setSkillInput] = useState('');

  const categories = [
    'IT & Software',
    'Engineering',
    'Data & AI',
    'Product Management',
    'Banking & Finance',
    'Sales & Marketing',
    'Human Resources',
    'Design & Creative',
  ];

  useEffect(() => {
    if (isEditMode) {
      loadJobDetails();
    }
  }, [id]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const res = await jobService.getJobById(id);
      if (res.data) {
        const j = res.data;
        setTitle(j.title || '');
        setCategory(j.category || 'IT & Software');
        setDescription(j.description || '');
        setResponsibilities(j.responsibilities || '');
        setRequirements(j.requirements || '');
        setMinExperience(j.minExperience ?? 0);
        setMaxExperience(j.maxExperience ?? 3);
        setEmploymentType(j.employmentType || 'Full-time');
        setWorkMode(j.workMode || 'Hybrid');
        setLocation(j.location || '');
        setState(j.state || '');
        setSalaryMin(j.salaryMin?.toString() || '');
        setSalaryMax(j.salaryMax?.toString() || '');
        setSalaryCurrency(j.salaryCurrency || 'INR');
        setVacancies(j.vacancies || 1);
        setApplicationDeadline(j.applicationDeadline ? j.applicationDeadline.split('T')[0] : '');
        
        if (j.skills && Array.isArray(j.skills)) {
          setSkills(j.skills.map((s) => (typeof s === 'string' ? s : s.skillName)));
        }
      }
    } catch (err) {
      setError('Failed to load existing job details for editing.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !location) {
      setError('Please provide the job title, description, and location.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const payload = {
        title,
        category,
        description,
        responsibilities,
        requirements,
        minExperience: Number(minExperience) || 0,
        maxExperience: Number(maxExperience) || 0,
        employmentType,
        workMode,
        location,
        state,
        salaryMin: salaryMin ? Number(salaryMin) : null,
        salaryMax: salaryMax ? Number(salaryMax) : null,
        salaryCurrency,
        vacancies: Number(vacancies) || 1,
        applicationDeadline: applicationDeadline || null,
        skills,
      };

      if (isEditMode) {
        await recruiterService.updateJob(id, payload);
      } else {
        await recruiterService.createJob(payload);
      }

      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job posting. Please check all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <LoadingSpinner text="Loading job information..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      <Link
        to="/recruiter/jobs"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--color-deep-maroon)',
          marginBottom: '1.25rem'
        }}
      >
        <ArrowLeft size={16} /> Back to My Postings
      </Link>

      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-dark-charcoal)', marginBottom: '0.25rem' }}>
            {isEditMode ? 'Edit Job Posting' : 'Post a New Vacancy'}
          </h1>
          <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.925rem' }}>
            Reach skilled candidates across top Indian engineering hubs with transparent criteria
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', backgroundColor: 'var(--color-white)' }}>
          {/* Section 1: Basic Role Info */}
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-soft-border)', paddingBottom: '0.5rem' }}>
            1. Role Title & Category
          </h3>

          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Lead Backend Engineer (Java / Microservices)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Category / Domain *</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Employment Type *</label>
              <select
                className="form-select"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Work Mode *</label>
              <select
                className="form-select"
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          {/* Section 2: Location, Experience & Compensation */}
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-soft-border)', paddingBottom: '0.5rem' }}>
            2. Location, Experience & Compensation
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Location (City) *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Bengaluru, Hyderabad, Pune"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Karnataka, Maharashtra"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Number of Vacancies</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={vacancies}
                onChange={(e) => setVacancies(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Min Experience (Yrs)</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={minExperience}
                onChange={(e) => setMinExperience(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Experience (Yrs)</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={maxExperience}
                onChange={(e) => setMaxExperience(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Min Annual CTC (₹)</label>
              <input
                type="number"
                placeholder="e.g. 1200000"
                className="form-control"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Annual CTC (₹)</label>
              <input
                type="number"
                placeholder="e.g. 2000000"
                className="form-control"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Application Deadline</label>
            <input
              type="date"
              className="form-control"
              value={applicationDeadline}
              onChange={(e) => setApplicationDeadline(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
          </div>

          {/* Section 3: Required Skills */}
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-soft-border)', paddingBottom: '0.5rem' }}>
            3. Required Skills & Tags
          </h3>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Add skill (e.g. Docker, PostgreSQL, React, AWS)..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(e);
                }
              }}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddSkill}
            >
              Add
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {skills.map((skill, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-warm-ivory)',
                  border: '1px solid var(--color-soft-border)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--color-deep-maroon)'
                }}
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-warm-grey)', padding: '0 2px' }}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          {/* Section 4: Detailed Descriptions */}
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-soft-border)', paddingBottom: '0.5rem' }}>
            4. Descriptions & Expectations
          </h3>

          <div className="form-group">
            <label className="form-label">Job Overview & Description *</label>
            <textarea
              rows="5"
              className="form-control"
              placeholder="Provide a comprehensive summary of what your team is building and why this role is critical..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Core Responsibilities</label>
            <textarea
              rows="4"
              className="form-control"
              placeholder="List daily duties, deliverables, system maintenance, and architectural goals..."
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Required Qualifications & Skills</label>
            <textarea
              rows="4"
              className="form-control"
              placeholder="Degrees, certifications, years of domain experience, and mandatory technical competencies..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--color-soft-border)', paddingTop: '1.25rem' }}>
            <Link to="/recruiter/jobs" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
            >
              {submitting ? 'Publishing...' : isEditMode ? 'Update Vacancy' : 'Publish Job Posting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruiterPostJobPage;
