import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const spinnerSize = size === 'sm' ? 'spinner-border-sm' : '';
  
  return (
    <div className="d-flex justify-content-center align-items-center py-4">
      <div 
        className={`spinner-border ${spinnerSize} text-primary ${className}`} 
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner; 