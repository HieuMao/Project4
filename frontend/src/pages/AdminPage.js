import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import UserList from './Admin/UserList';  
import ActivityList from './Activities/ActivityList'; // Updated path

const user = JSON.parse(localStorage.getItem('user'));
const isAdmin = user?.role === 'admin';

// Giao diện chung với menu cho admin
const AdminLayout = ({ children }) => (
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
      </nav>
    </header>
    <main style={{ padding: '20px' }}>
      {children}
    </main>
  </div>
);

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
      </Routes>
    </AdminLayout>
  );
}

export default AdminPage;