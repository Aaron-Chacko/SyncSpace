import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await authService.signup(name, email, password);
      navigate("/login");
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Create Account</h2>

      <div className="form-group">
        <label htmlFor="signup-name">Full Name</label>

        <input
          id="signup-name"
          type="text"
          placeholder="Full Name"
          aria-label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="signup-email">Email Address</label>

        <input
          id="signup-email"
          type="email"
          placeholder="Email Address"
          aria-label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="signup-password">Password</label>

        <input
          id="signup-password"
          type="password"
          placeholder="Password"
          aria-label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="primary-btn"
        aria-label="Sign Up"
      >
        Sign Up
      </button>
    </form>
  );
};

export default Signup;