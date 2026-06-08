import React from 'react';

const SkillBar = ({ label, percentage }) => {
  // Ensure percentage is bounded between 0 and 100
  const widthPercent = Math.max(0, Math.min(100, percentage || 0));

  return (
    <div className="skill-bar">
      <div className="skill-bar-header">
        <span className="skill-bar-label">{label}</span>
        <span className="skill-bar-value">{widthPercent}%</span>
      </div>
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{ width: `${widthPercent}%` }}
        />
      </div>
    </div>
  );
};

export default SkillBar;
