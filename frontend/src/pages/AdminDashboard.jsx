import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const adminSections = [
  { label: 'Manage Disasters', path: '/admin/disasters' },
  { label: 'View SOS Alerts', path: '/admin/sos' },
  { label: 'Real-Time Feed', path: '/admin/live' },
  { label: 'Real-time SOS Alerts', path: '/admin/sos-live' },
  // { label: 'Map (Stretch Goal)', path: '/admin/map' },
];

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <h1>Admin Control Panel</h1>
        <p className="dashboard-subtitle">Welcome, Admin! Choose a module to manage.</p>
        <div className="dashboard-options">
          {adminSections.map(({ label, path }) => (
            <div
              key={path}
              className="dashboard-card"
              onClick={() => navigate(path)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate(path);
                }
              }}
              role="button"
              aria-label={label}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
