import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ActivityList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/activities')
      .then(res => {
        setActivities(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Lỗi lấy dữ liệu: ' + err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải danh sách hoạt động...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Danh sách hoạt động nhân đạo</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', margin: 'auto' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tên hoạt động</th>
            <th>Mô tả</th>
            <th>Loại</th>
            <th>Địa điểm</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {activities.map(act => (
            <tr key={act.activity_id}>
              <td>{act.activity_id}</td>
              <td>
                {act.image_url ? (
                  <img
                    src={`http://localhost:5000/${act.image_url}`} 
                    alt={act.name}
                    style={{ width: 100, height: 'auto', objectFit: 'cover' }}
                  />
                ) : (
                  <span>Chưa có ảnh</span>
                )}
              </td>
              <td>{act.name}</td>
              <td>{act.description}</td>
              <td>{act.category}</td>
              <td>{act.location}</td>
              <td>{act.start_date ? new Date(act.start_date).toLocaleDateString() : ''}</td>
              <td>{act.end_date ? new Date(act.end_date).toLocaleDateString() : ''}</td>
              <td>{act.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ActivityList;
