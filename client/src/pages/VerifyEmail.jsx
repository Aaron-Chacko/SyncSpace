import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email…");

  useEffect(() => {
    api.get("/auth/verify-email", { params: { token: searchParams.get("token") } })
      .then((response) => setMessage(response.data.message))
      .catch((error) => setMessage(error.response?.data?.message || "Unable to verify this email."));
  }, [searchParams]);

  return <div className="auth-form"><h2>Email verification</h2><p>{message}</p><Link to="/login">Go to login</Link></div>;
}
