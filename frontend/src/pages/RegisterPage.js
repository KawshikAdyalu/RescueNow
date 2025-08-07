import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/authenticate/register', form);
      setMsg('✅ Registration successful! Please log in.');
      setForm({ username: '', email: '', password: '' });
    } catch (err) {
      setMsg(err.response?.data?.message || '❌ Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <form className="register-box" onSubmit={handleRegister}>
        <h2>📝 Create an Account</h2>

        <input
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        {msg && <div className="register-msg">{msg}</div>}

        {/* ✅ Already existing user */}
        <div className="link-text">
          Already have an account?{" "}
          <span onClick={() => navigate('/login')}>Login now</span>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
