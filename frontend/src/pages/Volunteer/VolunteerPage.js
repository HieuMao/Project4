import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import VolunteerLayout from './VolunteerLayout';
import ActivityList from '../Activities/ActivityList';
import DonorsList from '../Donate/DonorsList';

function VolunteerPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'volunteer') {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <VolunteerLayout>
      <Routes>
        <Route
          index
          element={
            <section className="content-section">
              <h2 className="title">Chào mừng bạn đến khu vực Tình nguyện viên</h2>
              <p>Hãy chọn hoạt động phù hợp để tham gia nhé!</p>
              <ActivityList mode="volunteer" />
            </section>
          }
        />
        <Route path="activities" element={<ActivityList mode="volunteer" />} />
        <Route path="profile" element={<Placeholder title="Thông tin cá nhân" />} />
        <Route path="registrations" element={<ActivityList mode="volunteer" />} />
        <Route path="/donors" element={<DonorsList />} />
      </Routes>
    </VolunteerLayout>
  );
}

const Placeholder = ({ title }) => (
  <section className="content-section">
    <h2 className="title">{title}</h2>
    <p>Chức năng đang phát triển...</p>
  </section>
);

export default VolunteerPage;