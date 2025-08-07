import React from "react";
import { useLiveUpdates } from "../sockets/SocketContext";
import "../styles/LiveUpdates.css";

function LiveUpdates() {
  const { updates, setUpdates } = useLiveUpdates();

  return (
    <div className="live-updates-container">
      {/* Header Section */}
      <div className="live-updates-header">
        <h2>Live Event Stream</h2>
        <button className="btn-clear" onClick={() => setUpdates([])}>
          Clear Updates
        </button>
      </div>

      {/* Update Stream Section */}
      <div className="live-updates-section">
        {updates.length === 0 ? (
          <p className="empty-message">No real-time updates yet.</p>
        ) : (
          <ul className="updates-list">
            {updates.map((u, idx) => (
              <li key={idx} className="update-card">
                <div className="update-text">
                  {u.type === "new-disaster" && (
                    <>
                      <span className="label-new">New Disaster</span>:{" "}
                      {u.payload.type} at <strong>{u.payload.location}</strong> (
                      {u.payload.severity})
                    </>
                  )}
                  {u.type === "update-disaster" && (
                    <>
                      <span className="label-update">Updated</span>:{" "}
                      {u.payload.type} ➝{" "}
                      <strong className={`status-tag ${u.payload.status}`}>
                        {u.payload.status}
                      </strong>
                    </>
                  )}
                  {u.type === "sos-alert" && (
                    <>
                      <span className="label-sos">SOS Alert</span>: {u.payload.message} <br />
                      <span className="coords">
                        (Lat: {u.payload.coordinates.coordinates[1]}, Lng:{" "}
                        {u.payload.coordinates.coordinates[0]})
                      </span>
                    </>
                  )}
                </div>
                <div className="update-timestamp">
                  {new Date(u.timestamp).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default LiveUpdates;
