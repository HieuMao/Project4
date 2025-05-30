import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Donate.css';

const Donate = () => {
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({
    donor_name: '',
    donor_type: 'individual',
    amount: '',
    item_description: '',
    payment_method: 'cash',
    activity_id: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Lấy danh sách hoạt động
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/activities');
        setActivities(res.data);
      } catch {
        setMessage('Không tải được danh sách hoạt động.');
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  // Cập nhật form khi người dùng gõ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/donate', form);
      setMessage('Ủng hộ thành công, bạn thật tuyệt! 🌟');
      setForm({
        donor_name: '',
        donor_type: 'individual',
        amount: '',
        item_description: '',
        payment_method: 'cash',
        activity_id: ''
      });
    } catch (err) {
      console.error(err);
      setMessage('Có lỗi xảy ra khi gửi, thử lại nhé 😢');
    }
  };

  return (
    <div className="donate-container">
      <h2 className="donate-title">Ủng Hộ Hoạt Động</h2>

      {message && <p className="donate-message">{message}</p>}
      {loading ? (
        <p className="donate-loading">Đang tải hoạt động... ⏳</p>
      ) : (
        <form onSubmit={handleSubmit} className="donate-form">
          <input
            type="text"
            name="donor_name"
            placeholder="Tên người ủng hộ"
            value={form.donor_name}
            onChange={handleChange}
            required
            className="donate-input"
          />

          <select
            name="donor_type"
            value={form.donor_type}
            onChange={handleChange}
            className="donate-select"
          >
            <option value="individual">Cá nhân</option>
            <option value="organization">Tổ chức</option>
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Số tiền ủng hộ"
            value={form.amount}
            onChange={handleChange}
            className="donate-input"
          />

          <textarea
            name="item_description"
            placeholder="Mô tả hiện vật (nếu có)"
            value={form.item_description}
            onChange={handleChange}
            className="donate-textarea"
          />

          <select
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
            className="donate-select"
          >
            <option value="cash">Tiền mặt</option>
            <option value="bank">Chuyển khoản</option>
            <option value="vnpay">VNPay</option>
            <option value="momo">MoMo</option>
            <option value="other">Khác</option>
          </select>

          <select
            name="activity_id"
            value={form.activity_id}
            onChange={handleChange}
            required
            className="donate-select"
          >
            <option value="">-- Chọn hoạt động --</option>
            {activities.length > 0 ? (
              activities.map((act) => (
                <option key={act.activity_id} value={act.activity_id}>
                  {act.name}
                </option>
              ))
            ) : (
              <option disabled>Không có hoạt động nào</option>
            )}
          </select>

          <button type="submit" className="donate-button">
            Ủng Hộ Ngay!
          </button>
        </form>
      )}
    </div>
  );
};

export default Donate;
