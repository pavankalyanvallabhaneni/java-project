import React from 'react';

const Badge = ({ variant = 'grey', children, className = '', style = {} }) => {
  const variantClassMap = {
    saffron: 'badge-saffron',
    green: 'badge-green',
    maroon: 'badge-maroon',
    grey: 'badge-grey',
    red: 'badge-red',
    applied: 'status-applied',
    'under-review': 'status-under-review',
    shortlisted: 'status-shortlisted',
    'interview-scheduled': 'status-interview-scheduled',
    selected: 'status-selected',
    rejected: 'status-rejected',
    withdrawn: 'status-withdrawn',
  };

  const badgeClass = variantClassMap[variant] || 'badge-grey';

  return (
    <span className={`badge ${badgeClass} ${className}`} style={style}>
      {children}
    </span>
  );
};

export default Badge;
