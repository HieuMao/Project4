// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      });
      alert('Đăng nhập thành công!');

      const user = res.data.user;
      // Ví dụ chuyển hướng theo role
      if (user.role === 'admin') window.location.href = '/admin';
      else if (user.role === 'staff') window.location.href = '/staff';
      else if (user.role === 'volunteer') window.location.href = '/volunteer';
      else window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đăng nhập');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Đăng nhập</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Đăng nhập</button>
    </form>
  );
}

export default Login;
