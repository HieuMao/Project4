import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ActivityList from '../Activities/ActivityList';

// Component hiển thị thông báo
const VolunteerNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/notifications'); // Thay bằng endpoint phù hợp
        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error('Lỗi khi lấy thông báo:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '5px' }}>
      <h2>Thông báo</h2>
      {notifications.length === 0 ? (
        <p>Không có thông báo nào.</p>
      ) : (
        <ul>
          {notifications.map((note) => (
            <li key={note.id} style={{ marginBottom: '10px' }}>
              <strong>{note.title}</strong><br />
              <span>{note.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Giả lập component DonorsList (bạn thay bằng component thật nếu có)
const DonorsList = () => (
  <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '5px' }}>
    <h2>Danh sách người đã ủng hộ</h2>
    <p>Chức năng đang phát triển...</p>
  </div>
);

// Layout for volunteer with navigation menu
const VolunteerLayout = ({ children }) => (
  <div className="app-container" style={{ backgroundColor: '#e6f3ff', minHeight: '100vh' }}>
    <header
      className="header"
      style={{
        padding: '10px 20px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <h1 style={{ fontSize: '24px', margin: '0 0 10px 0', color: '#333' }}>Tổ chức Nhân đạo</h1>
      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <Link to="/volunteer" style={navButtonStyle}>Trang chủ</Link>
        <Link to="/volunteer/activities" style={navButtonStyle}>Các hoạt động nhân đạo</Link>
        <Link to="/volunteer/registrations" style={navButtonStyle}>Đăng ký hoạt động</Link>
        <Link to="/volunteer/profile" style={navButtonStyle}>Thông tin cá nhân</Link>
        <Link to="/donate" style={navButtonStyle}>Quyên góp</Link>
        <Link to="/donors" style={navButtonStyle}>Danh sách người ủng hộ</Link>
        <Link to="/volunteer/notifications" style={navButtonStyle}>Thông báo</Link> {/* ✅ Mới thêm */}
        <Link to="/introduction" style={navButtonStyle}>Giới thiệu</Link>
        <Link to="/contact" style={navButtonStyle}>Liên hệ</Link>
        <Link to="/login" style={navButtonStyle}>Đăng nhập</Link>
      </nav>
    </header>
    <main style={{ padding: '20px' }}>
      {children}
    </main>
  </div>
);

// Button style reused
const navButtonStyle = {
  padding: '5px 10px',
  backgroundColor: '#007bff',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '5px'
};

// Placeholder for pages under development
const Placeholder = ({ title }) => (
  <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '5px' }}>
    <h2>{title}</h2>
    <p>Chức năng đang phát triển...</p>
  </div>
);

function VolunteerPage() {
  return (
    <VolunteerLayout>
      <Routes>
        <Route
          index
          element={
            <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fff', borderRadius: '5px' }}>
              <h2>Chào mừng bạn đến khu vực Tình nguyện viên</h2>
              <p>Hãy chọn hoạt động phù hợp để đăng ký tham gia!</p>
            </div>
          }
        />
        <Route path="activities" element={<ActivityList mode="volunteer" />} />
        <Route path="profile" element={<Placeholder title="Thông tin cá nhân" />} />
        <Route path="registrations" element={<Placeholder title="Đăng ký hoạt động" />} />
        <Route path="/donors" element={<DonorsList />} />
        <Route path="notifications" element={<VolunteerNotifications />} /> {/* ✅ Route mới */}
      </Routes>
    </VolunteerLayout>
  );
}

export default VolunteerPage;
