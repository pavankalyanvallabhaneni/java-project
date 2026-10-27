import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Lock, Mail, AlertCircle, ArrowRight, UserCheck, Shield, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your registered email and password.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const loggedUser = await login(email, password);
      
      if (from) {
        navigate(from, { replace: true });
        return;
      }

      // Default role redirect
      const role = loggedUser.role.startsWith('ROLE_') ? loggedUser.role : `ROLE_${loggedUser.role}`;
      if (role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'ROLE_RECRUITER') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const setDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
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
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
            Welcome to BharatHire
          </h1>
          <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.925rem' }}>
            Sign in to access your recruitment pipeline or job tracker
          </p>
        </div>

        {/* Login Card */}
        <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--color-white)', boxShadow: 'var(--shadow-md)' }}>
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
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

            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--color-deep-maroon)', fontWeight: 600 }}>
                  Forgot Password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-warm-grey)' }} />
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--color-soft-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-deep-maroon)', marginBottom: '0.65rem' }}>
              <Sparkles size={14} style={{ color: 'var(--color-saffron)' }} /> QUICK DEMO ACCOUNT LOGINS:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setDemoCredentials('arun.kumar@gmail.com', 'Candidate@123')}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
              >
                Candidate (Arun)
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setDemoCredentials('neha.singh@gmail.com', 'Candidate@123')}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
              >
                Candidate (Neha)
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setDemoCredentials('recruiter@tcs.in', 'Recruiter@123')}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
              >
                Recruiter (TCS)
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setDemoCredentials('admin@bharathire.in', 'Admin@123')}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
              >
                Administrator
              </button>
            </div>
          </div>
        </div>

        {/* Register link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-warm-grey)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: 700, color: 'var(--color-deep-maroon)' }}>
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
