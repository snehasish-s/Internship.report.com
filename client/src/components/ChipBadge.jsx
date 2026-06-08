import React from 'react';

const ChipBadge = ({ label, variant = 'muted' }) => {
  const getClassName = () => {
    switch (variant) {
      case 'pink':
        return 'chip chip-pink';
      case 'success':
        return 'chip chip-success';
      case 'error':
        return 'chip chip-error';
      case 'muted':
      default:
        return 'chip chip-muted';
    }
  };

  return (
    <span className={getClassName()}>
      {label}
    </span>
  );
};

export default ChipBadge;
