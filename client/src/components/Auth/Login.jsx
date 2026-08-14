import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, Sparkles, ArrowRight, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setError("");
    setIsSubmitting(true);

    try {
      const userData = await authService.login(email.trim(), password);
      setAuthUser(userData);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to log in. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rich-auth-card">
      <div className="auth-card-header">
        <div className="auth-logo-badge">
          <Sparkles size={24} className="auth-sparkle-icon" />
        </div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your SyncSpace workspace & collaborative editor</p>
      </div>

      {error && (
        <div className="auth-error-banner" role="alert">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form className="auth-form-body" onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label htmlFor="login-email" className="auth-label">
            <Mail size={14} />
            <span>Email Address</span>
          </label>
          <div className="auth-input-wrapper">
            <input
              id="login-email"
              type="email"
              className="auth-input"
              placeholder="name@company.com"
              aria-label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="auth-form-group">
          <div className="auth-label-row">
            <label htmlFor="login-password" className="auth-label">
              <Lock size={14} />
              <span>Password</span>
            </label>
            <Link to="/forgot-password" className="auth-forgot-link">
              Forgot password?
            </Link>
          </div>
          <div className="auth-input-wrapper">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              className="auth-input password-input"
              placeholder="Enter your password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={isSubmitting}
          aria-label="Log In"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="spinning-loader" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Log In to Workspace</span>
              <ArrowRight size={16} className="btn-arrow" />
            </>
          )}
        </button>
      </form>

      <div className="auth-card-footer">
        <span>Don't have an account?</span>
        <Link to="/signup" className="auth-switch-link">
          Create an Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
