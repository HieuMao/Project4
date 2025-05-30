import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

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
      // Chuyển hướng về trang đăng nhập sau 2 giây
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đăng ký. Thử lại đi! 😞');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <main className="content-container">
        <section className="content-section">
          <h2 className="title">Đăng ký</h2>
          
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <form onSubmit={handleRegister} className="login-form">
            <input
              type="text"
              placeholder="Họ và tên"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="form-input"
              disabled={loading}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="form-input"
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="form-input"
              disabled={loading}
            />

            <input
              type="tel" // Đổi thành type="tel" cho số điện thoại
              placeholder="Số điện thoại"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              className="form-input"
              disabled={loading}
            />

            <button type="submit" className="nav-button" disabled={loading}>
              {loading ? 'Đang xử lý... ⏳' : 'Đăng ký'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Register;