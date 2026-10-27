import React, { useState, useEffect } from 'react';
import { recruiterService } from '../../api/recruiterService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Building2, Globe, MapPin, CheckCircle2, AlertCircle, Briefcase, Users } from 'lucide-react';

const RecruiterCompanyPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Fields
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('');
  const [companySize, setCompanySize] = useState('10000+');
  const [companyHeadquarters, setCompanyHeadquarters] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await recruiterService.getProfile();
      if (res.data) {
        setProfile(res.data);
        setDesignation(res.data.designation || '');
        setDepartment(res.data.department || '');
        setCompanyName(res.data.companyName || '');
        setCompanyWebsite(res.data.companyWebsite || '');
        setCompanyIndustry(res.data.companyIndustry || '');
        setCompanySize(res.data.companySize || '1000-5000');
        setCompanyHeadquarters(res.data.companyHeadquarters || '');
        setCompanyDescription(res.data.companyDescription || '');
        setCompanyLogoUrl(res.data.companyLogoUrl || '');
      }
    } catch (err) {
      console.error('Failed to load company profile:', err);
      setAlert({ type: 'danger', message: 'Unable to retrieve company information.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName) {
      setAlert({ type: 'danger', message: 'Company name is required.' });
      return;
    }

    try {
      setSaving(true);
      setAlert({ type: '', message: '' });
      const payload = {
        designation,
        department,
        companyName,
        companyWebsite,
        companyIndustry,
        companySize,
        companyHeadquarters,
        companyDescription,
        companyLogoUrl,
      };

      const res = await recruiterService.updateProfile(payload);
      if (res.data) {
        setProfile(res.data);
        setAlert({ type: 'success', message: 'Company and recruiter profile updated successfully.' });
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to update company details.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <LoadingSpinner text="Loading company profile..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-dark-charcoal)', marginBottom: '0.25rem' }}>
            Company & Employer Profile
          </h1>
          <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.925rem' }}>
            Manage your organization's brand presence on BharatHire
          </p>
        </div>

        {alert.message && (
          <div className={`alert alert-${alert.type}`} style={{ marginBottom: '1.5rem' }}>
            {alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{alert.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', backgroundColor: 'var(--color-white)' }}>
          {/* Company Verification Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            backgroundColor: profile?.isVerified ? 'var(--color-muted-green-light)' : 'var(--color-warm-ivory)',
            border: `1px solid ${profile?.isVerified ? '#C8E3CF' : 'var(--color-soft-border)'}`,
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Building2 size={24} style={{ color: profile?.isVerified ? 'var(--color-muted-green)' : 'var(--color-deep-maroon)' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
                  Verification Status
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-warm-grey)' }}>
                  {profile?.isVerified
                    ? 'Verified Indian Employer badge active across all your posted vacancies.'
                    : 'Employer verification pending administrative review.'}
                </p>
              </div>
            </div>

            <span className={`badge ${profile?.isVerified ? 'badge-green' : 'badge-saffron'}`}>
              {profile?.isVerified ? 'VERIFIED' : 'PENDING'}
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-soft-border)', paddingBottom: '0.5rem' }}>
            Organization Information
          </h3>

          <div className="form-group">
            <label className="form-label">Company Legal Name *</label>
            <input
              type="text"
              className="form-control"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Official Website</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://company.com"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Logo Image URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={companyLogoUrl}
                onChange={(e) => setCompanyLogoUrl(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Industry Domain</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. IT Services, Consumer Internet, Banking"
                value={companyIndustry}
                onChange={(e) => setCompanyIndustry(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Employee Count</label>
              <select
                className="form-select"
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
              >
                <option value="1-50">1-50 employees</option>
                <option value="50-200">50-200 employees</option>
                <option value="200-1000">200-1,000 employees</option>
                <option value="1000-5000">1,000-5,000 employees</option>
                <option value="5000-10000">5,000-10,000 employees</option>
                <option value="10000+">10,000+ employees</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Headquarters</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Mumbai, Maharashtra"
                value={companyHeadquarters}
                onChange={(e) => setCompanyHeadquarters(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Company Overview / About Us</label>
            <textarea
              rows="4"
              className="form-control"
              placeholder="Tell candidates about your company culture, technology stack, mission, and growth story..."
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
            />
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-soft-border)', paddingBottom: '0.5rem' }}>
            Your Role in Company
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="form-label">Designation / Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Lead Talent Acquisition Specialist"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department / Hiring Function</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Engineering & Product Hiring"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={saving}
            style={{ width: '100%', padding: '0.85rem' }}
          >
            {saving ? 'Updating Company Details...' : 'Save Company Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecruiterCompanyPage;
