import React from 'react';

const EmptyState = ({ title = 'No data available', text = 'Try adjusting your filters or log a new session.' }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">⚡</div>
      <div className="empty-state-title">{title}</div>
      <div className="empty-state-text">{text}</div>
    </div>
  );
};

export default EmptyState;
