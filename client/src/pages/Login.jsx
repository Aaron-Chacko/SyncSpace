import React from 'react';
import LoginContainer from '../components/Auth/Login';

const Login = () => {
  return (
    <div className="page login-page" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <LoginContainer />
    </div>
  );
};

export default Login;