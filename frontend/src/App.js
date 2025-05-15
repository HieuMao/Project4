import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import UserList from './pages/Admin/UserList';

function App() {
  const styles = {
    container: {
      textAlign: 'center',
      marginTop: '50px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      fontSize: '28px',
      marginBottom: '40px',
    },
    menu: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      alignItems: 'center',
    },
    button: {
      padding: '15px 30px',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: '#1976d2',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      width: '250px',
      textDecoration: 'none',
      display: 'inline-block',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Hệ thống Quản lý Hoạt động Nhân đạo</h1>

      <div style={styles.menu}>
        <Link style={styles.button} to="/admin/users">
          Quản lý Người dùng
        </Link>
        <Link style={styles.button} to="/activities">
          Quản lý Hoạt động
        </Link>
        <Link style={styles.button} to="/volunteers">
          Quản lý Tình nguyện viên
        </Link>
        <Link style={styles.button} to="/donations">
          Quản lý Quyên góp
        </Link>
        <Link style={styles.button} to="/reports">
          Báo cáo - Thống kê
        </Link>
      </div>

      <Routes>
        <Route path="/admin/users" element={<UserList />} />
        {/* Thêm các route khác nếu muốn */}
      </Routes>
    </div>
  );
}

export default App;
