import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, Mail, Lock, Phone, MapPin, Building2, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'RECRUITER' ? 'ROLE_RECRUITER' : 'ROLE_CANDIDATE';

  const [role, setRole] = useState(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Candidate specific
  const [currentLocation, setCurrentLocation] = useState('');

  // Recruiter specific
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (role === 'ROLE_RECRUITER' && !companyName) {
      setError('Company name is required for recruiter registration.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const payload = {
        fullName,
        email,
        password,
        phone,
        role,
        currentLocation: role === 'ROLE_CANDIDATE' ? currentLocation : undefined,
        companyName: role === 'ROLE_RECRUITER' ? companyName : undefined,
        companyWebsite: role === 'ROLE_RECRUITER' ? companyWebsite : undefined,
        designation: role === 'ROLE_RECRUITER' ? designation : undefined,
        department: role === 'ROLE_RECRUITER' ? department : undefined,
      };

      const user = await register(payload);
      if (role === 'ROLE_RECRUITER') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email may already be taken.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 150px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem',
      backgroundColor: 'var(--color-warm-ivory)'
    }}>
      <div style={{ width: '100%', maxWidth: '540px' }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-deep-maroon)',
            color: 'var(--color-saffron)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
            boxShadow: '0 4px 10px rgba(112, 28, 53, 0.25)'
          }}>
            <Briefcase size={26} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-dark-charcoal)' }}>
            Join BharatHire Today
          </h1>
          <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.925rem' }}>
            Empowering India's professionals and enterprise recruiters
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--color-white)', boxShadow: 'var(--shadow-md)' }}>
          {/* Role Segmented Switcher */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            backgroundColor: 'var(--color-warm-ivory)',
            padding: '0.35rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-soft-border)',
            marginBottom: '1.5rem'
          }}>
            <button
              type="button"
              className={`btn btn-sm ${role === 'ROLE_CANDIDATE' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setRole('ROLE_CANDIDATE'); setError(''); }}
              style={{ padding: '0.6rem', border: 'none' }}
            >
              <User size={16} /> Job Seeker
            </button>
            <button
              type="button"
              className={`btn btn-sm ${role === 'ROLE_RECRUITER' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setRole('ROLE_RECRUITER'); setError(''); }}
              style={{ padding: '0.6rem', border: 'none' }}
            >
              <Building2 size={16} /> Employer / Recruiter
            </button>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-grey)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Arun Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-grey)' }} />
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password * (Min 6 characters)</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-grey)' }} />
                <input
                  type="password"
                  className="form-control"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-grey)' }} />
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            {/* Candidate Extra Fields */}
            {role === 'ROLE_CANDIDATE' && (
              <div className="form-group">
                <label className="form-label">Current City</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-grey)' }} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Bengaluru, Pune, Hyderabad"
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>
            )}

            {/* Recruiter Extra Fields */}
            {role === 'ROLE_RECRUITER' && (
              <>
                <div className="form-group">
                  <label className="form-label">Company / Organization Name *</label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-grey)' }} />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Tata Consultancy Services"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      style={{ paddingLeft: '38px' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Company Website</label>
                  <div style={{ position: 'relative' }}>
                    <Globe size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-grey)' }} />
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://company.com"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      style={{ paddingLeft: '38px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Lead Talent Partner"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Tech Hiring"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
            >
              {submitting ? 'Creating Profile...' : 'Complete Registration'}
            </button>
          </form>
        </div>

        {/* Sign in footer */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-warm-grey)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 700, color: 'var(--color-deep-maroon)' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
