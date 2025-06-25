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
  const [points, setPoints] = useState(0);
  const token = localStorage.getItem('token');

  useEffect(() => {
  const fetchData = async () => {
    try {
      console.log('Fetching activities...');
      const res = await axios.get('http://localhost:5000/api/activities');
      setActivities(Array.isArray(res.data) ? res.data : []);

      if (token && isVolunteerDonate) {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        setUserName(user.name || 'Người dùng');
        setForm((prev) => ({ ...prev, donor_name: user.name || '' }));

        console.log('Fetching registrations...');
        const registrationsRes = await axios.get('http://localhost:5000/api/volunteer/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const registrations = registrationsRes.data.registrations || [];
        setRegisteredActivities(registrations.map(reg => Number(reg.activity_id)));

        // 👉 GỌI API lấy điểm ở đây
        console.log('Fetching points...');
        const pointsRes = await axios.get('http://localhost:5000/api/users/points', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Points response:', pointsRes.data);
        setPoints(pointsRes.data.total_points || 0);
      }
    } catch (err) {
      console.error('Fetch Error:', err.response ? err.response.data : err.message);
      setMessage('Không tải được danh sách hoạt động hoặc thông tin người dùng. Chi tiết: ' + (err.response?.data?.error || err.message));
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
      console.log('Submitting donation with token:', token ? token.substring(0, 10) + '...' : 'No token'); // Debug token
      const response = await axios.post('http://localhost:5000/api/donate', form, config);
      console.log('Donation response:', response.data);
      setMessage('Ủng hộ thành công, bạn thật tuyệt! 🌟');
      setForm({
        donor_name: token && isVolunteerDonate ? userName : '',
        donor_type: 'individual',
        amount: '',
        item_description: '',
        payment_method: 'cash',
        activity_id: ''
      });
      if (token && isVolunteerDonate) {
        console.log('Fetching points after donation...');
        const pointsRes = await axios.get('http://localhost:5000/api/users/points', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Points response:', pointsRes.data);
        setPoints(pointsRes.data.total_points || 0);
      }
    } catch (err) {
      console.error('Submit Error:', err.response ? err.response.data : err.message);
      setMessage('Có lỗi xảy ra khi gửi, thử lại nhé 😢. Chi tiết:', err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="donate-container">
      <h2 className="donate-title">Ủng Hộ Hoạt Động</h2>
      {token && isVolunteerDonate && <p className="donate-points">Tổng điểm của bạn: {points}</p>}

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
            {activities.length > 0 ? (
              activities.map((act) => (
                <option
                  key={act.activity_id}
                  value={act.activity_id}
                >
                  {act.name || `Hoạt động ${act.activity_id}`}
                </option>
              ))
            ) : (
              <option value="" disabled>Không có hoạt động nào</option>
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