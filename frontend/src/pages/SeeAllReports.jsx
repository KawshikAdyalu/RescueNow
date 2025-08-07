import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/SeeAllReports.css';

function SeeAllReports({ token }) {
  const [disasters, setDisasters] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    severity: '',
    status: '',
    page: 1,
    limit: 5
  });

  const [alert, setAlert] = useState('');

  const fetchDisasters = async () => {
    try {
      const res = await api.get('/disasters', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      if (res.data.success) {
        setDisasters(res.data.data);
        setTotal(res.data.count);
      } else {
        setAlert('Failed to fetch reports.');
      }
    } catch {
      setAlert('Error fetching disasters.');
    }
  };

  useEffect(() => {
    fetchDisasters();
    // eslint-disable-next-line
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const changePage = (delta) => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(prev.page + delta, 1)
    }));
  };

  return (
    <div className="see-all-container">
      <h2>All Disaster Reports</h2>
      {alert && <div className="alert-message">{alert}</div>}

      {/* Filter Controls */}
      <div className="filter-controls">
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">Type</option>
          <option value="Flood">Flood</option>
          <option value="Fire">Fire</option>
          <option value="Quake">Quake</option>
          <option value="Storm">Storm</option>
        </select>
        <select name="severity" value={filters.severity} onChange={handleFilterChange}>
          <option value="">Severity</option>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">Status</option>
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
        </select>
        <button
          onClick={() => setFilters({ ...filters, type: '', severity: '', status: '', page: 1 })}
        >
          Clear Filters
        </button>
      </div>

      {/* Disaster List */}
      <div className="table-wrapper">
        {disasters.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Reported By</th>
              </tr>
            </thead>
            <tbody>
              {disasters.map((d) => (
                <tr key={d._id}>
                  <td>{d.type}</td>
                  <td>{d.location}</td>
                  <td>{d.severity}</td>
                  <td>{d.status}</td>
                  <td>{d.createdBy?.username || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => changePage(-1)} disabled={filters.page === 1}>
          &#8592; Prev
        </button>
        <span>Page {filters.page}</span>
        <button
          onClick={() => changePage(1)}
          disabled={disasters.length < filters.limit}
        >
          Next &#8594;
        </button>
      </div>
    </div>
  );
}

export default SeeAllReports;
