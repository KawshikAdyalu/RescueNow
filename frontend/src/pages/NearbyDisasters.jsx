import React, { useState } from 'react';
import api from '../api/axios';
import '../styles/NearbyDisasters.css';

function NearbyDisasters({ token }) {
  const [location, setLocation] = useState({ lat: '', lng: '', radius: 20000 });
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);

  const handleLocationDetect = () => {
    if (!navigator.geolocation) {
      setMessage("❌ Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);
    setMessage('Locating...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(prev => ({
          ...prev,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6)
        }));
        setMessage('📍 Location detected.');
        setLoadingLocation(false);
      },
      () => {
        setMessage('❌ Could not get location, please allow GPS access.');
        setLoadingLocation(false);
      }
    );
  };

  const handleSearch = async () => {
    const { lat, lng, radius } = location;
    if (!lat || !lng) {
      setMessage('❗ Latitude and Longitude are required.');
      return;
    }

    setLoadingResults(true);
    setMessage('');
    setResults([]);

    try {
      const res = await api.get('/disasters/nearby', {
        headers: { Authorization: `Bearer ${token}` },
        params: { lat, lng, radius }
      });

      if (res.data.success) {
        setResults(res.data.data);
        setMessage(`✅ Found ${res.data.count} nearby disaster(s).`);
      } else {
        setMessage('⚠️ No nearby disasters found.');
      }
    } catch {
      setMessage('❌ Error fetching nearby disasters.');
    } finally {
      setLoadingResults(false);
    }
  };

  const handleInputChange = (e) => {
    setLocation(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="nearby-container">
      <h2>Nearby Disasters</h2>
      {message && <div className="message">{message}</div>}

      <div className="controls">
        <input
          type="number"
          name="lat"
          value={location.lat}
          onChange={handleInputChange}
          placeholder="Latitude"
          step="any"
        />
        <input
          type="number"
          name="lng"
          value={location.lng}
          onChange={handleInputChange}
          placeholder="Longitude"
          step="any"
        />
        <input
          type="number"
          name="radius"
          value={location.radius}
          onChange={handleInputChange}
          placeholder="Radius (meters)"
          min="1"
          step="100"
        />
        <button onClick={handleLocationDetect} disabled={loadingLocation}>
          {loadingLocation ? "Locating..." : "📍 Use My Location"}
        </button>
        <button onClick={handleSearch} disabled={loadingResults}>
          {loadingResults ? "Searching..." : "🔍 Search"}
        </button>
      </div>

      <div className="results">
        {results.length === 0 ? (
          <p>No nearby disasters to display.</p>
        ) : (
          <ul>
            {results.map((d, idx) => (
              <li key={idx}>
                <b>{d.type}</b> - {d.location} ({d.severity}) — reported by{' '}
                {d.createdBy?.username || 'Unknown'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NearbyDisasters;
