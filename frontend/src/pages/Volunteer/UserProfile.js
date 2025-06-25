// src/pages/UserProfile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const profileRes = await axios.get('http://localhost:5000/api/users/users/me', config);
        const pointsRes = await axios.get('http://localhost:5000/api/users/points', config);

        setUser(profileRes.data);
        setPoints(pointsRes.data.total_points || 0);
      } catch (err) {
        console.error('Lỗi khi tải thông tin:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) return <p>Đang tải thông tin tài khoản...</p>;

  return (
    <div className="account-container">
      <h2>Tài khoản của tôi</h2>
      <p><strong>Tên:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Số điện thoại:</strong> {user.phone}</p>
      <p><strong>Vai trò:</strong> {user.role}</p>
      <p><strong>🎁 Điểm tích lũy:</strong> {points}</p>
    </div>
  );
};

export default UserProfile;
