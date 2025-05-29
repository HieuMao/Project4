import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import UserList from './Admin/UserList';  
import ActivityList from './Activities/ActivityList'; // Updated path
import ActivityMembers from './Admin/ActivityMembers';
const user = JSON.parse(localStorage.getItem('user'));
const isAdmin = user?.role === 'admin';

const AdminLayout = ({ children }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Hoặc dùng useNavigate nếu bạn muốn mượt hơn
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="header-title">Hệ thống Quản lý Hoạt động Nhân đạo</h1>
        <nav className="nav">
          <Link to="/admin" className="nav-button">Trang chủ Admin</Link>
          <Link to="/admin/users" className="nav-button">Quản lý Người dùng</Link>
          <Link to="/admin/activities" className="nav-button">Quản lý Hoạt động</Link>
          <Link to="/admin/volunteers" className="nav-button">Quản lý Tình nguyện viên</Link>
          <Link to="/admin/donations" className="nav-button">Quản lý Quyên góp</Link>
          <Link to="/admin/reports" className="nav-button">Báo cáo - Thống kê</Link>
          <Link to="/admin/activity-members" className="nav-button">Thành viên đăng ký hoạt động</Link>
          <button className="nav-button" onClick={handleLogout}>Đăng xuất</button>
        </nav>
      </header>
      <main style={{ padding: '20px' }}>
        {children}
      </main>
    </div>
  );
};

const Placeholder = ({ title }) => (
  <div style={{ padding: '20px' }}>
    <h2>{title}</h2>
    <p>Chức năng đang phát triển...</p>
  </div>
);

function AdminPage() {
  if (!isAdmin) {
    return <div>Bạn không có quyền truy cập trang này.</div>;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<div>Chào mừng đến trang Admin</div>} />
        <Route path="users" element={<UserList />} />
        <Route path="activities" element={<ActivityList mode="admin" />} />
        <Route path="volunteers" element={<Placeholder title="Quản lý Tình nguyện viên" />} />
        <Route path="donations" element={<Placeholder title="Quản lý Quyên góp" />} />
        <Route path="reports" element={<Placeholder title="Báo cáo - Thống kê" />} />
        <Route path="activity-members" element={<ActivityMembers />} />

      </Routes>
    </AdminLayout>
  );
}

export default AdminPage;