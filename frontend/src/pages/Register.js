import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('http://localhost:5000/api/users/register', {
        name,
        email,
        password,
        phone,
      });

      setSuccess(res.data.message);
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đăng ký');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Đăng ký</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <input
        type="text"
        placeholder="Họ và tên"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />

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

      <input
        type="text"
        placeholder="Số điện thoại"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        required
      />

      <button type="submit">Đăng ký</button>
    </form>
  );
}

export default Register;
