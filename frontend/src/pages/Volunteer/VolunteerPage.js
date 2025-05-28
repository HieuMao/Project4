import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ActivityList from '../Activities/ActivityList';
import Header from '../../components/Header';

// Layout for volunteer with navigation menu
const VolunteerLayout = ({ children }) => (
  <div className="app-container" style={{ backgroundColor: '#e6f3ff', minHeight: '100vh' }}>
    <header className="header" style={{ padding: '10px', backgroundColor: '#fff', borderBottom: '1px solid #ccc' }}>
      <h1 className="header-title" style={{ fontSize: '24px', margin: '0', color: '#333' }}>Tổ chức Nhân đạo</h1>
      <nav className="nav" style={{ marginTop: '10px' }}>
        <Link to="/volunteer" className="nav-button" style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>Trang chủ</Link>
        <Link to="/volunteer/activities" className="nav-button" style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>Các hoạt động nhân đạo</Link>
        <Link to="/introduction" className="nav-button" style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>Giới thiệu</Link>
        <Link to="/contact" className="nav-button" style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>Liên hệ</Link>
        <Link to="/login" className="nav-button" style={{ padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>Đăng nhập</Link>
      </nav>
    </header>
    <main style={{ padding: '20px' }}>
      {children}
    </main>
  </div>
);

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
        <Route index element={
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fff', borderRadius: '5px' }}>
            <h2>Chào mừng bạn đến khu vực Tình nguyện viên</h2>
            <p>Hãy chọn hoạt động phù hợp để đăng ký tham gia!</p>
          </div>
        } />
        <Route path="activities" element={<ActivityList mode="volunteer" />} />
        <Route path="profile" element={<Placeholder title="Thông tin cá nhân" />} />
        <Route path="registrations" element={<Placeholder title="Đăng ký hoạt động" />} />
      </Routes>
    </VolunteerLayout>
  );
}

export default VolunteerPage;