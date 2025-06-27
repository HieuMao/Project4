import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Thêm Link

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
      alert('Đăng nhập thành công! 🎉');
      const user = res.data.user;
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (user.role === 'admin') window.location.href = '/admin';
      else if (user.role === 'staff') window.location.href = '/staff';
      else if (user.role === 'volunteer') window.location.href = '/volunteer';
      else window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đăng nhập. Vui lòng thử lại nha! 😞');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <main className="content-container">
        <section className="content-section">
          <h2 className="title">Đăng nhập</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              disabled={loading}
            />
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              disabled={loading}
            />
            <button type="submit" className="nav-button" disabled={loading}>
              {loading ? 'Đang xử lý... ⏳' : 'Đăng nhập'}
            </button>
            <Link to="/forgot-password" className="nav-button forgot-password">
              Quên mật khẩu?
            </Link>
            <Link to="/register" className="nav-button register-button" disabled={loading}>
              Đăng ký
            </Link>
          </form>

        </section>
      </main>
    </div>
  );
}

export default Login;