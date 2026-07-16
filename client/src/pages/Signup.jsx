import React from 'react';
import SignupContainer from '../components/Auth/Signup';

const Signup = () => {
  return (
    <div className="page signup-page" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <SignupContainer />
    </div>
  );
};

export default Signup;