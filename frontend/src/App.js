import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Introduction from './pages/Introduction';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPage from './pages/AdminPage';
import StaffPage from './pages/StaffPage';
import VolunteerPage from './pages/VolunteerPage';
import UserList from './pages/Admin/UserList';
import './App.css';

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
    <div className="page-container">
      <Header />
      <main className="content-container">
        <section className="content-section">
          <h2 className="title">Chào mừng đến với Tổ chức Nhân đạo</h2>
          <p>{introText}</p>
          <h3>Tầm quan trọng:</h3>
          <ul>
            {importancePoints.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </section>
        <section className="content-section">
          <h2 className="title">Hoạt động nổi bật</h2>
          <ul>
            {activities.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </section>
      </main>
      <footer className="footer">
        <div>Tổ chức Nhân đạo © 2025</div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <div className="page-container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/introduction" element={<Introduction />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/volunteer" element={<VolunteerPage />} />
        <Route path="/admin/users" element={<UserList />} />
      </Routes>
    </div>
  );
}

export default App;