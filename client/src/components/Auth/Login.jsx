import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login to SyncSpace</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Log In</button>
    </form>
  );
};

export default Login;