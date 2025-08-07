import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/ManageSOS.css";

function ManageSOS({ token }) {
  const [sosList, setSosList] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchSOS = async () => {
      try {
        const res = await api.get("/sos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSosList(res.data.data || []);
      } catch {
        setMsg("❌ Failed to load SOS alerts.");
      }
    };

    fetchSOS();
  }, [token]);

  return (
    <div className="manage-sos-container">
      <h2 className="page-title">SOS Alerts</h2>
      {msg && <p className="error-message">{msg}</p>}

      {sosList.length === 0 ? (
        <p className="empty-message">No SOS alerts found.</p>
      ) : (
        <ul className="sos-list">
          {sosList.map((sos, index) => (
            <li key={index} className="sos-item">
              <p><b>Message:</b> {sos.message}</p>
              <p><b>Status:</b> {sos.status}</p>
              <p><b>Coordinates:</b> Lat: {sos.coordinates.coordinates[1]}, Lng: {sos.coordinates.coordinates[0]}</p>
              <p><b>User:</b> {sos.userId?.username || sos.userId?.email || "N/A"}</p>
              <small>Created at: {new Date(sos.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ManageSOS;
