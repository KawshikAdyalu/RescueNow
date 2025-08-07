import React from "react";
import { useLiveUpdates } from "../sockets/SocketContext";
import MapView from "../components/MapView";
import "../styles/AdminSosLive.css";

function AdminSosLive() {
  const { updates, setUpdates } = useLiveUpdates();

  // Filter just SOS alerts
  const sosEvents = updates.filter((e) => e.type === "sos-alert");

  // Prepare marker data for map
  const markers = sosEvents.map((e, index) => ({
    position: [
      e.payload.coordinates.coordinates[1], // Lat
      e.payload.coordinates.coordinates[0], // Lng
    ],
    popup: `
    <strong>SOS:</strong> ${e.payload.message || "Emergency!"}<br/>
    <strong>User:</strong> ${e.payload.userId?.username || e.payload.userId?.email || "Unknown"}<br/>
    <strong>Time:</strong> ${new Date(e.timestamp).toLocaleString()}
    `,
  }));

  return (
    <div className="admin-sos-container">
      <h2 className="sos-heading">Admin SOS Live Map</h2>

      {markers.length > 0 ? (
        <div className="map-container">
          <MapView markers={markers} zoom={11} />
        </div>
      ) : (
        <p className="fallback-text">No SOS markers to display on map yet.</p>
      )}

      <div className="sos-list-section">
        <div className="sos-list-header">
          <h3>SOS Alerts List</h3>
          <button className="clear-button" onClick={() => setUpdates([])}>
            🧹 Clear SOS Feed
          </button>
        </div>

        {sosEvents.length === 0 ? (
          <p>No SOS alerts received yet.</p>
        ) : (
          <ul className="sos-list">
            {sosEvents.map((e, index) => (
              <li key={index} className="sos-card">
                <div className="sos-time">
                  🕒 <strong>{new Date(e.timestamp).toLocaleString()}</strong>
                </div>
                <div className="sos-body">
                  🚨 <strong>{e.payload.message}</strong> <br />
                  👤 From:{" "}
                  <strong>
                    {e.payload.userId?.username ||
                      e.payload.userId?.email ||
                      "Unknown"}
                  </strong>
                  <br />
                  📍 Lat: {e.payload.coordinates.coordinates[1]}, Lng:{" "}
                  {e.payload.coordinates.coordinates[0]}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminSosLive;
