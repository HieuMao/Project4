import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = params.get('token');
    try {
      const res = await axios.post('http://localhost:5000/api/users/reset-password', {
        token,
        new_password: password
      });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Lỗi reset mật khẩu');
    }
  };

  return (
    <div>
      <h2>Đặt lại mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="Mật khẩu mới" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Đặt lại</button>
      </form>
      <p>{msg}</p>
    </div>
  );
};

export default ResetPassword;
