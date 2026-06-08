import React from 'react';

const Topbar = ({ title, children }) => {
  return (
    <header className="topbar">
      <div className="topbar-title">
        {title}
      </div>
      <div className="topbar-actions">
        {children}
      </div>
    </header>
  );
};

export default Topbar;
