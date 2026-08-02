import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await authService.login(email, password);
      setAuthUser(userData);
      navigate("/room/demo");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login to SyncSpace</h2>

      <div className="form-group">
        <label htmlFor="login-email">Email</label>

        <input
          id="login-email"
          type="email"
          placeholder="Email"
          aria-label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Password</label>

        <input
          id="login-password"
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
        aria-label="Log In"
      >
        Log In
      </button>
    </form>
  );
};

export default Login;