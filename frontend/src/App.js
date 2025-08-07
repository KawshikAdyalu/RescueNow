import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import CreateReport from "./pages/CreateReport";
import SeeAllReports from "./pages/SeeAllReports";
import SendSOS from "./pages/SendSOS";
import LiveUpdates from "./pages/LiveUpdates";
import { SocketProvider } from "./sockets/SocketContext";
import NearbyDisasters from './pages/NearbyDisasters';
import AdminDashboard from './pages/AdminDashboard';
import AdminManageReports from "./pages/AdminManageReports";
import ManageSOS from "./pages/ManageSOS";
import AdminLiveDashboard from "./pages/AdminLiveDashboard";
import AdminSosLive from "./pages/AdminSosLive";
import LandingPage from "./pages/LandingPage";
function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  return (
    <SocketProvider token={token}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage setToken={setToken} setRole={setRole} />} />
          <Route path="/register" element={<RegisterPage />} />

          {/** User dashboard routes */}
          <Route path="/dashboard" element={token && role === 'user' ? <UserDashboard token={token} /> : <Navigate to="/login" />} />
        <Route path="/dashboard/create-report" element={<CreateReport token={token} />} />
        <Route path="/dashboard/see-all" element={<SeeAllReports token={token} />} />
        <Route path="/dashboard/sos" element={<SendSOS token={token} />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/dashboard/live-updates" element={<LiveUpdates token={token} />} />
        <Route path="/dashboard/nearby" element={<NearbyDisasters token={token} />} />
    <Route
  path="/admin"
  element={token && role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
/>
    <Route
  path="/admin/disasters"
  element={token && role === "admin" ? <AdminManageReports token={token} /> : <Navigate to="/login" />}
/>

    <Route path="/admin/sos" element={<ManageSOS token={token} />} />

<Route path="/admin/live" element={
  token && role === 'admin' ? <AdminLiveDashboard token={token} /> : <Navigate to="/login" />
} />

<Route
  path="/admin/sos-live"
  element={
    token && role === "admin" ? <AdminSosLive /> : <Navigate to="/login" />
  }
/>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
