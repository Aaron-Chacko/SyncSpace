import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Room from "./pages/Room";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Navbar from "./components/Shared/Navbar";

import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
        <div
          className="app-container"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Navbar />

          <div style={{ flex: 1, display: "flex" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/room/:roomId"
                element={
                  <ProtectedRoute>
                    <Room />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
