import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const VolunteerLayout = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user'));
      setUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="page-container" style={{ backgroundColor: '#e6f3ff', minHeight: '100vh' }}>
      <header className="header">
        <div className="navbar">
          <div className="logo">Tổ chức Nhân đạo</div>
          <nav className="nav">
            <Link to="/volunteer" className="nav-button">Trang chủ</Link>
            <Link to="/volunteer/activities" className="nav-button">Các hoạt động nhân đạo</Link>
            <Link to="/volunteer/registrations" className="nav-button">Đăng ký hoạt động</Link>
            <Link to="/volunteer/profile" className="nav-button">Thông tin cá nhân</Link>
            <Link to="/donate" className="nav-button">Quyên góp</Link>
            <Link to="/donors" className="nav-button">Danh sách người ủng hộ</Link>
            <Link to="/introduction" className="nav-button">Giới thiệu</Link>
            <Link to="/contact" className="nav-button">Liên hệ</Link>
            {user ? (
              <button className="nav-button" onClick={handleLogout} style={{ marginLeft: '10px' }}>
                Đăng xuất
              </button>
            ) : (
              <Link to="/login" className="nav-button login-button">Đăng nhập</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="content-container">
        {children}
      </main>
    </div>
  );
};

export default VolunteerLayout;