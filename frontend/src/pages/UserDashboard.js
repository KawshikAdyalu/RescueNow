import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserDashboard.css';

const options = [
  { label: 'Create Report', path: 'create-report' },
  { label: 'Live Updates', path: 'live-updates' },
  { label: 'Raise Emergency Alert', path: 'sos' },
  { label: 'See All Reports', path: 'see-all' },
  { label: 'Nearby Disasters', path: 'nearby' },
];

function UserDashboard() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(`/dashboard/${path}`);
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        <h1>RescueNow User Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome! Choose an action below.
        </p>
        <div className="dashboard-options">
          {options.map(({ label, path }) => (
            <div
              key={path}
              className="dashboard-card"
              onClick={() => handleNavigate(path)}
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleNavigate(path);
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

export default UserDashboard;
