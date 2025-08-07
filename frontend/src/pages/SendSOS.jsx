import React, { useState } from 'react';
import api from '../api/axios';
import '../styles/SendSOS.css';

function SendSOS({ token }) {
  const [form, setForm] = useState({
    lat: '',
    lng: '',
    message: ''
  });

  const [response, setResponse] = useState('');
  const [detecting, setDetecting] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      return alert('Geolocation is not supported.');
    }

    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      pos => {
        setForm(prev => ({
          ...prev,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6)
        }));
        setResponse('📍 Location detected.');
        setDetecting(false);
      },
      () => {
        setResponse('❌ Failed to detect location.');
        setDetecting(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse('');

    try {
      const res = await api.post('/sos', form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setResponse('✅ SOS sent successfully!');
        setForm({ lat: '', lng: '', message: '' });
      } else {
        setResponse('❌ Failed to send SOS.');
      }
    } catch (err) {
      setResponse('❌ ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="sos-container">
      <h2>Raise Emergency Alert</h2>

      {response && (
        <div className={`sos-response ${response.startsWith('✅') ? 'success' : response.startsWith('📍') ? 'info' : 'error'}`}>
          {response}
        </div>
      )}

      <form onSubmit={handleSubmit} className="sos-form">
        <div className="sos-coordinates">
          <div>
            <label>Latitude</label>
            <input
              name="lat"
              type="number"
              placeholder="Latitude"
              value={form.lat}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Longitude</label>
            <input
              name="lng"
              type="number"
              placeholder="Longitude"
              value={form.lng}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="button"
            onClick={handleAutoDetectLocation}
            className="location-button"
            disabled={detecting}
            title="Detect your location"
          >
            {detecting ? "Locating..." : "📍 Use My Location"}
          </button>
        </div>

        <label>Message (optional)</label>
        <textarea
          name="message"
          placeholder="Optional message (e.g. Fire, trapped)"
          value={form.message}
          onChange={handleChange}
          rows={3}
        />

        <button type="submit" className="sos-submit">Send SOS</button>
      </form>
    </div>
  );
}

export default SendSOS;
