import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devToken, setDevToken] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your account email address.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await authService.forgotPassword({ email });
      setSuccess(true);
      if (res.data) {
        setDevToken(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request. Please check email address.');
    } finally {
      setLoading(false);
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
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--color-white)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-warm-ivory)',
              color: 'var(--color-deep-maroon)',
              border: '1px solid var(--color-soft-border)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem'
            }}>
              <KeyRound size={22} />
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-dark-charcoal)' }}>
              Password Recovery
            </h2>
            <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.875rem' }}>
              Enter your email address to receive password reset instructions
            </p>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={48} style={{ color: 'var(--color-muted-green)', margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-charcoal)' }}>
                  Instructions Dispatched
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-warm-grey)' }}>
                  If an account exists with <strong>{email}</strong>, recovery instructions have been initiated.
                </p>
              </div>

              {devToken && (
                <div style={{
                  backgroundColor: 'var(--color-warm-ivory)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-soft-border)',
                  marginBottom: '1.5rem'
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-deep-maroon)', display: 'block', marginBottom: '4px' }}>
                    DEMO ENVIRONMENT RESET TOKEN:
                  </span>
                  <code style={{ fontSize: '0.825rem', wordBreak: 'break-all', color: 'var(--color-dark-charcoal)' }}>
                    {devToken}
                  </code>
                </div>
              )}

              <Link
                to={devToken ? `/reset-password?token=${encodeURIComponent(devToken)}` : '/reset-password'}
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '0.75rem' }}
              >
                Proceed to Reset Password
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Registered Email</label>
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

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '0.75rem' }}
              >
                {loading ? 'Sending Instructions...' : 'Request Password Reset'}
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-soft-border)' }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-deep-maroon)'
              }}
            >
              <ArrowLeft size={16} /> Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
