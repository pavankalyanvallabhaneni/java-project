import React from 'react';
import { Briefcase } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Briefcase,
  title = 'No records found',
  description = 'There is currently no data matching your criteria.',
  action,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={32} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
