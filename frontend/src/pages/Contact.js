import React, { useState } from 'react';
import Header from '../components/Header';
import '../App.css';
import { sendContactMessage } from '../services/userService';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendContactMessage(formData);
      setStatus('Tin nhắn đã được gửi thành công!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <div className="page-container">
      <Header />
      <main className="content-container">
        <section className="content-section">
          <h2 className="title">Liên hệ</h2>
          <p>Email: caovanbinh987@email.com</p>
          <p>Điện thoại: 0987 05 1975</p>
          <p>Địa chỉ: 122 Đường Lê Thánh Tông, Sầm Sơn, TP. Thanh Hóa</p>
          <h3>Gửi tin nhắn cho chúng tôi</h3>
          <form onSubmit={handleSubmit} className="contact-form">
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
            <textarea
              name="message"
              placeholder="Nội dung tin nhắn"
              value={formData.message}
              onChange={handleChange}
              required
              className="form-textarea"
            ></textarea>
            <button type="submit" className="nav-button">Gửi</button>
            {status && <p>{status}</p>}
          </form>
        </section>
      </main>

    </div>
  );
};

export default Contact;