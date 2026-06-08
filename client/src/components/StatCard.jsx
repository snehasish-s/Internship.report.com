import React from 'react';

const StatCard = ({ value, label, delta, isPositive, ghostChar }) => {
  return (
    <div className="stat-card">
      {ghostChar && <div className="stat-card-ghost">{ghostChar}</div>}
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
      {delta && (
        <div className={`stat-card-delta ${isPositive ? 'positive' : ''}`}>
          {delta}
        </div>
      )}
    </div>
  );
};

export default StatCard;
