import React from 'react';

const Loader = () => {
  return (
    <div className="app-loader" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <div className="spinner">Loading...</div>
    </div>
  );
};

export default Loader;