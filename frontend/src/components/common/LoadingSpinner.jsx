import React from 'react';

const LoadingSpinner = ({ text = 'Loading...', size = 'md' }) => {
  const sizeMap = {
    sm: { width: '18px', height: '18px', borderWidth: '2px' },
    md: { width: '32px', height: '32px', borderWidth: '3px' },
    lg: { width: '48px', height: '48px', borderWidth: '4px' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.85rem',
      padding: '2rem 1rem'
    }}>
      <div
        className="spinner"
        style={{
          width: currentSize.width,
          height: currentSize.height,
          borderWidth: currentSize.borderWidth
        }}
      />
      {text && (
        <span style={{
          fontSize: '0.875rem',
          color: 'var(--color-warm-grey)',
          fontWeight: 500
        }}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
