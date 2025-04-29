import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  return (
    <div className="custom-loading-spinner">
      <div className="spinner-circle"></div>
      <div className="spinner-text">Loading...</div>
    </div>
  );
};

export default Spinner; 