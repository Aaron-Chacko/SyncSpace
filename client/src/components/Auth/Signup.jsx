import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.signup(name, email, password);
      navigate('/login');
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Create Account</h2>
      <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
      <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;