import React, { useState } from 'react';
import api from '../api/axios';
import '../styles/CreateReport.css';

function CreateReport({ token }) {
  const [form, setForm] = useState({
    type: '',
    description: '',
    location: '',
    severity: 'low',
    lng: '',
    lat: ''
  });

  const [msg, setMsg] = useState({ text: '', type: '' });
  const [geoStatus, setGeoStatus] = useState({ loading: false, error: '', success: '' });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    try {
      const payload = {
        ...form,
        severity: form.severity || 'low',
        status: 'active',
        lng: parseFloat(form.lng),
        lat: parseFloat(form.lat)
      };

      const res = await api.post('/disasters', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMsg({ text: '✅ ' + res.data.message, type: 'success' });
      setForm({ type: '', description: '', location: '', severity: 'low', lng: '', lat: '' });
      setGeoStatus({ loading: false, error: '', success: '' });
    } catch (err) {
      setMsg({ text: '❌ ' + (err.response?.data?.message || 'Something went wrong'), type: 'error' });
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus({ loading: false, error: 'Geolocation is not supported by your browser.', success: '' });
      return;
    }

    setGeoStatus({ loading: true, error: '', success: '' });

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        setForm(prev => ({
          ...prev,
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6)
        }));
        setGeoStatus({ loading: false, error: '', success: '📍 Location successfully set!' });
      },
      () => {
        setGeoStatus({ loading: false, error: 'Unable to retrieve your location. Please enable GPS and allow permission.', success: '' });
      }
    );
  };

  return (
    <div className="create-report-container">
      <h2>Create Disaster Report</h2>

      {msg.text && (
        <div className={`message ${msg.type}`}>
          {msg.text}
        </div>
      )}

      {geoStatus.loading && <div className="geo-message info">Getting current location...</div>}
      {geoStatus.error && <div className="geo-message error">{geoStatus.error}</div>}
      {geoStatus.success && <div className="geo-message success">{geoStatus.success}</div>}

      <form onSubmit={handleSubmit} className="create-report-form">
        <label htmlFor="type">Disaster Type *</label>
        <input
          id="type"
          name="type"
          placeholder="e.g. Flood, Earthquake"
          value={form.type}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          placeholder="Describe the situation..."
          value={form.description}
          onChange={handleChange}
          required
          rows="4"
        />

        <label htmlFor="location">Location *</label>
        <input
          id="location"
          name="location"
          placeholder="Where is it happening?"
          value={form.location}
          onChange={handleChange}
          required
        />

        <label htmlFor="severity">Severity</label>
        <select id="severity" name="severity" value={form.severity} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>

        <div className="coordinate-inputs">
          <div>
            <label htmlFor="lng">Longitude</label>
            <input
              id="lng"
              name="lng"
              type="number"
              placeholder="Longitude"
              value={form.lng}
              onChange={handleChange}
              step="any"
              required
            />
          </div>

          <div>
            <label htmlFor="lat">Latitude</label>
            <input
              id="lat"
              name="lat"
              type="number"
              placeholder="Latitude"
              value={form.lat}
              onChange={handleChange}
              step="any"
              required
            />
          </div>
        </div>

        <button
          type="button"
          className="location-button"
          onClick={handleUseLocation}
          disabled={geoStatus.loading}
        >
          {geoStatus.loading ? 'Getting Location...' : 'Use My Location'}
        </button>

        <button type="submit" className="submit-button">Submit Report</button>
      </form>
    </div>
  );
}

export default CreateReport;
