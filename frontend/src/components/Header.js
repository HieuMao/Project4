import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Header = () => {
  return (
    <header className="header">
      <div className="navbar">
        <div className="logo">Tổ chức Nhân đạo</div>
        <nav className="nav">
          <NavLink to="/">Trang chủ</NavLink>
          <NavLink to="/activities">Các hoạt động nhân đạo</NavLink>
          <NavLink to="/introduction">Giới thiệu</NavLink>
          <NavLink to="/contact">Liên hệ</NavLink>
          <Link to="/login" className="nav-button login-button">Đăng nhập</Link>
        </nav>
      </div>
    </header>
  );
};

const NavLink = ({ to, children }) => {
  return <Link to={to} className="nav-button">{children}</Link>;
};

export default Header;