import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ActivitiesWithMembers() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchActivities = async () => {
      if (!token) {
        setError('Không có token, vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('http://localhost:5000/api/volunteer/activities-members', config);

        setActivities(response.data.activities || []);
        setLoading(false);
      } catch (err) {
        setError('Lỗi lấy dữ liệu: ' + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    };
    fetchActivities();
  }, [token]);

  if (loading) return <p>Đang tải danh sách hoạt động...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  if (activities.length === 0) return <p>Chưa có hoạt động nào được đăng ký.</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách hoạt động và thành viên đăng ký</h2>
      {activities.map(activity => (
        <div key={activity.activity_id} className="mb-6 p-4 border rounded shadow">
          <h3 className="text-xl font-semibold">{activity.activity_name}</h3>
          <p>Trạng thái: {activity.status}</p>
          <p>Thời gian: {new Date(activity.start_date).toLocaleDateString()} - {new Date(activity.end_date).toLocaleDateString()}</p>
          <div className="mt-2">
            <strong>Thành viên đăng ký:</strong>
            {activity.members.length === 0 ? (
              <p className="italic text-gray-500">Chưa có thành viên nào đăng ký.</p>
            ) : (
              <ul className="list-disc list-inside">
                {activity.members.map(member => (
                  <li key={member.user_id}>{member.name} (ID: {member.user_id})</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActivitiesWithMembers;
