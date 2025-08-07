import React, { useEffect, useState } from 'react';
import api from '../api/axios';

function AdminManageReports({ token }) {
  const [reports, setReports] = useState([]);
  const [updateMsg, setUpdateMsg] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [selectedDisasterId, setSelectedDisasterId] = useState('');
  const [newStatus, setNewStatus] = useState('');

  // 🚀 Fetch all disaster reports on load or refresh
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/admin/reports', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(res.data.data || []);
      } catch (err) {
        setUpdateMsg('❌ Failed to load reports.');
      }
    };

    fetchReports();
  }, [token, refresh]);

  // ✅ Submit status update + admin action
  const handleUpdateStatus = async (id) => {
    try {
     await api.put(`/admin/reports/${id}/action`, {
  status: newStatus,
  action: {
    type: 'other', // or 'communication', 'supply_food', etc.
    notes: adminNote
  }
}, {
  headers: { Authorization: `Bearer ${token}` }
});


      setUpdateMsg('✅ Status updated');
      setAdminNote('');
      setNewStatus('');
      setSelectedDisasterId('');
      setRefresh(prev => !prev); // trigger re-fetch
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      setUpdateMsg('❌ Update failed');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📋 Admin: Manage All Disaster Reports</h2>
      {updateMsg && (
        <p style={{ color: updateMsg.includes('✅') ? 'green' : 'red' }}>{updateMsg}</p>
      )}

      <div>
        {reports.map(report => (
          <div
            key={report._id}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '5px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <b>{report.type}</b> — {report.location} ({report.severity})
            <br />
            Status: <b>{report.status}</b> | Detailed Status:{' '}
            <b>{report.detailedStatus || 'N/A'}</b>
            <br />
            Created by: {report.createdBy?.username || 'N/A'}
            <br />
            Assigned to: {report.assignedTo?.username || 'None'}
            <br />
            <br />

            <button
              onClick={() => setSelectedDisasterId(report._id)}
              style={{
                backgroundColor: '#333',
                color: '#fff',
                padding: '6px 12px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🛠 Update Status
            </button>

            {/* Update Status form */}
            {selectedDisasterId === report._id && (
              <div style={{ marginTop: '1rem' }}>
                <label>New Status: </label>{' '}
               <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
  <option value="">Select</option>
  <option value="pending">Pending</option>
  <option value="in-progress">In Progress</option>
  <option value="resolved">Resolved</option>
</select>


                <br /><br />
                <textarea
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  placeholder="Enter action notes..."
                  rows={3}
                  style={{ width: '100%' }}
                /><br /><br />

                <button
                  onClick={() => handleUpdateStatus(report._id)}
                  style={{
                    backgroundColor: 'green',
                    color: 'white',
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ✅ Update Now
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminManageReports;
