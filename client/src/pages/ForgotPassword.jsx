import React, { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../services/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const result = await authService.requestPasswordReset(email);
    setMessage(result.message);
  };

  return <form className="auth-form" onSubmit={submit}>
    <h2>Reset your password</h2>
    {message && <p>{message}</p>}
    <input type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} required />
    <button type="submit" className="primary-btn">Send reset link</button>
    <Link to="/login">Back to login</Link>
  </form>;
}
