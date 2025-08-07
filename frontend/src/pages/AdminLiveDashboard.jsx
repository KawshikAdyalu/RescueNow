import React from "react";
import { useLiveUpdates } from "../sockets/SocketContext";
import MapView from "../components/MapView";
import "../styles/AdminLiveDashboard.css";

function AdminLiveDashboard() {
  const { updates, setUpdates } = useLiveUpdates();

  // Prepare markers for map from events with coordinates
  const mapMarkers = updates
    .filter(
      (e) =>
        (e.type === "sos-alert" || e.type === "new-disaster") &&
        e.payload?.coordinates
    )
    .map((e, i) => ({
      position: [
        e.payload.coordinates.coordinates[1], // lat
        e.payload.coordinates.coordinates[0], // lng
      ],
      popup: `
        ${e.type === "sos-alert" ? "🚨 SOS:" : "🆕 Disaster:"}
        ${e.payload.message || e.payload.type} <br/>
        🕒 ${new Date(e.timestamp).toLocaleString()}
      `,
    }));

  return (
    <div className="admin-live-dashboard">
      <h2 className="page-title">Admin Live Feed</h2>

      <button className="clear-button" onClick={() => setUpdates([])}>
        🧹 Clear Feed
      </button>

      <section className="map-section">
        <h3 className="section-title">🗺 Live Event Map</h3>
        {mapMarkers.length > 0 ? (
          <MapView markers={mapMarkers} zoom={11} />
        ) : (
          <p className="fallback-text">No events to display on the map yet.</p>
        )}
      </section>

      <section className="list-section">
        <h3 className="section-title">Event List</h3>
        {updates.length === 0 ? (
          <p className="fallback-text">No real-time events yet.</p>
        ) : (
          <ul className="event-list">
            {updates.map((event, index) => (
              <li key={index} className="event-card">
                <div className="event-time">
                  <b>🕒 {new Date(event.timestamp).toLocaleString()}</b>
                </div>
                <div className="event-details">
                  {event.type === "new-disaster" && (
                    <span>
                      🆕 <b>{event.payload.type}</b> disaster reported at{" "}
                      <b>{event.payload.location}</b> ({event.payload.severity})
                    </span>
                  )}
                  {event.type === "update-disaster" && (
                    <span>
                      🔁 <b>{event.payload.type}</b> updated to{" "}
                      <b>{event.payload.status}</b>
                    </span>
                  )}
                  {event.type === "sos-alert" && (
                    <span>
                      🚨 SOS: <b>{event.payload.message}</b> from{" "}
                      <b>{event.payload.userId?.username || "Anonymous"}</b>
                      <br />
                      📍 Lat: {event.payload.coordinates.coordinates[1]}, Lng:{" "}
                      {event.payload.coordinates.coordinates[0]}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default AdminLiveDashboard;
