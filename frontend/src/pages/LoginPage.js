import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/LoginPage.css';

function LoginPage({ setToken, setRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/authenticate/login', { email, password });
      setToken(res.data.token);
      setRole(res.data.user.role);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      setMsg('✅ Login successful!');
      window.location.href = res.data.user.role === 'admin' ? '/admin' : '/dashboard';
    } catch (err) {
      setMsg(err.response?.data?.message || '❌ Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>🚀 RescueNow Login</h2>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Authenticating...' : 'Login'}
        </button>

        {msg && <div className="login-msg">{msg}</div>}

        {/* ➕ Add Register Redirect */}
        <div className="link-text">
          New user? <span onClick={() => navigate('/register')}>Create an account</span>
        </div>

      </form>
    </div>
  );
}

export default LoginPage;
