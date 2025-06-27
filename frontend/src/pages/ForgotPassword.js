import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/forgot-password', { email });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Lỗi gửi yêu cầu');
    }
  };

  return (
    <div>
      <h2>Quên mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Nhập email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Gửi yêu cầu</button>
      </form>
      <p>{msg}</p>
    </div>
  );
};

export default ForgotPassword;
