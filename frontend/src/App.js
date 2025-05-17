import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import StaffPage from './pages/StaffPage';
import VolunteerPage from './pages/VolunteerPage';

// Giao diện chính trang chủ
function HomePage() {
  const introText = `Hoạt động nhân đạo là những hành động thể hiện lòng nhân ái...`;
  const importancePoints = [
    "Giúp đỡ những người yếu thế trong xã hội.",
    "Giảm thiểu thiệt hại do thiên tai, dịch bệnh, xung đột gây ra.",
    "Xây dựng tinh thần đoàn kết, yêu thương giữa con người với nhau.",
    "Góp phần ổn định và phát triển xã hội bền vững."
  ];
  const activities = [
    "Cứu trợ khẩn cấp...",
    "Khám chữa bệnh...",
    "Hỗ trợ giáo dục...",
    "Phát triển sinh kế...",
    "Bảo vệ quyền lợi..."
  ];

  return (
    <div>
      <header style={styles.header}>
        <div style={styles.navbar}>
          <div style={styles.logo}>Tổ chức Nhân đạo</div>
          <nav style={styles.navLinks}>
            <NavLink to="/">Trang chủ</NavLink>
            <NavLink to="/activities">Các hoạt động nhân đạo</NavLink>
            <NavLink to="/introduction">Giới thiệu</NavLink>
            <NavLink to="/contact">Liên hệ</NavLink>
            <Link to="/login" style={styles.loginButton}>Đăng nhập</Link>
          </nav>
        </div>
      </header>

      <main style={styles.mainContent}>
        <section>
          <h2 style={styles.sectionTitle}>Giới thiệu về hoạt động nhân đạo</h2>
          <p>{introText}</p>
          <h3>Tầm quan trọng:</h3>
          <ul>
            {importancePoints.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </section>
        <section>
          <h2 style={styles.sectionTitle}>Hoạt động nổi bật</h2>
          <ul>
            {activities.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </section>
      </main>

      <footer style={styles.footer}>
        <div>Tổ chức Nhân đạo &copy; 2025</div>
      </footer>
    </div>
  );
}

// Điều hướng trang trong App
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/staff" element={<StaffPage />} />
      <Route path="/volunteer" element={<VolunteerPage />} />
      {/* Bạn có thể thêm các route khác như /activities, /contact... */}
    </Routes>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} style={styles.navLink}>
      {children}
    </Link>
  );
}

// ✅ Định nghĩa styles đúng chỗ
const styles = {
  pageContainer: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#222',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: '#004085',
    boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
    zIndex: 1000,
  },
  navbar: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    fontWeight: '700',
    fontSize: '1.7rem',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    marginLeft: 25,
    fontWeight: 600,
    fontSize: '1rem',
    position: 'relative',
    padding: '6px 8px',
    transition: 'color 0.25s ease',
  },
  loginButton: {
    marginLeft: 25,
    backgroundColor: 'white',
    color: '#004085',
    fontWeight: '700',
    padding: '8px 16px',
    borderRadius: 5,
    textDecoration: 'none',
    boxShadow: '0 2px 6px rgba(0,64,133,0.3)',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  mainContent: {
    flexGrow: 1,
    maxWidth: 900,
    margin: '40px auto',
    padding: '0 20px',
  },
  section: {
    marginBottom: 50,
  },
  sectionTitle: {
    borderBottom: '3px solid #004085',
    paddingBottom: 8,
    marginBottom: 20,
    fontSize: '1.9rem',
    color: '#004085',
  },
  subTitle: {
    fontSize: '1.4rem',
    marginTop: 20,
    marginBottom: 10,
    color: '#004085',
  },
  paragraph: {
    fontSize: '1.1rem',
    lineHeight: 1.7,
  },
  list: {
    fontSize: '1.1rem',
    lineHeight: 1.6,
    paddingLeft: 20,
  },
  footer: {
    marginTop: 'auto',
    backgroundColor: '#f1f3f5',
    padding: '20px 15px',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#555',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
  },
};

export default App;
