import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authService from "../services/auth";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (event) => {
    event.preventDefault();
    try {
      login(await authService.resetPassword(searchParams.get("token"), password));
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to reset your password.");
    }
  };

  return <form className="auth-form" onSubmit={submit}>
    <h2>Choose a new password</h2>
    {error && <p role="alert">{error}</p>}
    <input type="password" placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} minLength="8" required />
    <button type="submit" className="primary-btn">Reset password</button>
  </form>;
}
