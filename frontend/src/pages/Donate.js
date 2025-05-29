import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    axios.get('http://localhost:5000/api/activities')
      .then(res => {
        console.log('Hoạt động nhận được:', res.data); // ✅ Log dữ liệu
        setActivities(res.data);
      })
      .catch(() => setMessage('Không thể tải danh sách hoạt động.'));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/donate', form);
      setMessage('Ủng hộ thành công!');
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
      setMessage('Lỗi khi gửi ủng hộ.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Ủng hộ cho hoạt động</h2>

      {message && <p className="mb-4 text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="donor_name"
          placeholder="Tên người ủng hộ"
          value={form.donor_name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <select
          name="donor_type"
          value={form.donor_type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
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
          className="w-full border p-2 rounded"
        />

        <textarea
          name="item_description"
          placeholder="Mô tả hiện vật (nếu có)"
          value={form.item_description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="payment_method"
          value={form.payment_method}
          onChange={handleChange}
          className="w-full border p-2 rounded"
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
          className="w-full border p-2 rounded"
        >
          <option value="">-- Chọn hoạt động --</option>
          {activities.length > 0 ? (
            activities.map(act => (
              <option key={act.activity_id} value={act.activity_id}>
                {act.name}
              </option>
            ))
          ) : (
            <option disabled>Không có hoạt động nào</option>
          )}
        </select>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Ủng hộ
        </button>
      </form>
    </div>
  );
};

export default Donate;
