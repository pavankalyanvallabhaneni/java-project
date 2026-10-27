import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '3rem 1.5rem'
    }}>
      <div style={{ maxWidth: '480px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          backgroundColor: 'var(--color-cream)',
          color: 'var(--color-deep-maroon)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem'
        }}>
          <Briefcase size={32} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-dark-charcoal)', marginBottom: '0.5rem' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-deep-maroon)', marginBottom: '0.75rem' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--color-warm-grey)', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
          The page you are looking for doesn't exist, has been archived, or was moved.
        </p>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={16} /> Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
