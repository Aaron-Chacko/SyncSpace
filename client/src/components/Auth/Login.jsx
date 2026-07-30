import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = await authService.login(email, password);
      setAuthUser(userData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Unable to log in. Please try again.');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login to SyncSpace</h2>
      {error && <p role="alert">{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button
        type="submit"
        className="primary-btn"
      >
        Log In
      </button>
      <Link to="/forgot-password">Forgot password?</Link>
    </form>
  );
};

export default Login;
