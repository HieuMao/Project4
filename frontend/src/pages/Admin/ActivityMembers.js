import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ActivityMembers() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/volunteer/activities-members', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActivities(res.data.activities);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p style={{ color: 'red' }}>Lỗi: {error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Thành viên đăng ký hoạt động</h2>
      {activities.map(activity => (
        <div key={activity.activity_id} className="border p-4 mb-4 rounded shadow">
          <h3 className="text-lg font-semibold">{activity.activity_name}</h3>
          <p>Thời gian: {new Date(activity.start_date).toLocaleDateString()} - {new Date(activity.end_date).toLocaleDateString()}</p>
          <p>Trạng thái: {activity.status}</p>
          <strong>Thành viên đăng ký:</strong>
          {activity.members.length > 0 ? (
            <ul className="list-disc list-inside">
              {activity.members.map(member => (
                <li key={member.user_id}>{member.name} (ID: {member.user_id})</li>
              ))}
            </ul>
          ) : (
            <p className="italic text-gray-500">Chưa có ai đăng ký.</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default ActivityMembers;
