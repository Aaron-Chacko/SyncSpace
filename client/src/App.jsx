import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Room from "./pages/Room";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Navbar from "./components/Shared/Navbar";

import { AuthProvider } from "./context/AuthContext";
import Replay from "./pages/Replay";
import Loading from "./pages/Loading";
import NotFound from "./pages/NotFound";
import NetworkError from "./pages/NetworkError";
import AccessDenied from "./pages/AccessDenied";

function App() {
  return (
    <Router>
      <AuthProvider>
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
              <Route path="/replay" element={<Replay />} />
              <Route path="/loading" element={<Loading />} />
              <Route path="/network-error" element={<NetworkError />} />
              <Route path="/access-denied" element={<AccessDenied />} />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;