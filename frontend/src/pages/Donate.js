import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './Donate.css';

const Donate = () => {
  const location = useLocation();
  const isVolunteerDonate = location.pathname === '/volunteer/donate';
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
  const [userName, setUserName] = useState('');
  const [registeredActivities, setRegisteredActivities] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/activities');
      setActivities(res.data);

      if (token && isVolunteerDonate) {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        setUserName(user.name || 'Người dùng');
        setForm((prev) => ({ ...prev, donor_name: user.name || '' }));

        const registrationsRes = await axios.get('http://localhost:5000/api/volunteer/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const registrations = registrationsRes.data.registrations || [];
        setRegisteredActivities(registrations.map(reg => reg.activity_id));
      }
    } catch (err) {
      console.error('Fetch Error:', err.response ? err.response.data : err.message);
      setMessage('Không tải được danh sách hoạt động hoặc thông tin người dùng.');
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [token, isVolunteerDonate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isVolunteerDonate && !token) {
      setMessage('Vui lòng đăng nhập với vai trò volunteer để ủng hộ.');
      return;
    }
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      if (isVolunteerDonate && !registeredActivities.includes(parseInt(form.activity_id))) {
        setMessage('Bạn chỉ có thể ủng hộ cho các hoạt động đã đăng ký.');
        return;
      }
      await axios.post('http://localhost:5000/api/donate', form, config);
      setMessage('Ủng hộ thành công, bạn thật tuyệt! 🌟');
      setForm({
        donor_name: token && isVolunteerDonate ? userName : '',
        donor_type: 'individual',
        amount: '',
        item_description: '',
        payment_method: 'cash',
        activity_id: ''
      });
    } catch (err) {
      console.error('Submit Error:', err.response ? err.response.data : err.message);
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
          {(!token || !isVolunteerDonate) && (
            <input
              type="text"
              name="donor_name"
              placeholder="Tên người ủng hộ"
              value={form.donor_name}
              onChange={handleChange}
              required={!token}
              className="donate-input"
            />
          )}
          {token && isVolunteerDonate && <p className="donate-user">Tên: {userName}</p>}

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
            {activities.map((act) => (
              <option
                key={act.activity_id}
                value={act.activity_id}
                disabled={isVolunteerDonate && !registeredActivities.includes(act.activity_id)}
              >
                {act.name}
              </option>
            ))}
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