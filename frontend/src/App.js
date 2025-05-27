import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Introduction from './pages/Introduction';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPage from './pages/AdminPage';
import StaffPage from './pages/StaffPage';
import VolunteerPage from './pages/Volunteer/VolunteerPage';
import UserList from './pages/Admin/UserList';
import './App.css';

function HomePage() {
  const activities = [
    { name: "Cứu trợ khẩn cấp", description: "Lực lượng cứu hộ giúp đỡ người dân trong vùng lũ lụt.", image: "/cuu-tro.jpg" },
    { name: "Khám chữa bệnh", description: "Nhân viên y tế khám bệnh cho người dân tại khu vực khó khăn.", image: "/kham-chua-benh.jpg" },
    { name: "Hỗ trợ giáo dục", description: "Tình nguyện viên giảng dạy cho trẻ em ở vùng sâu vùng xa.", image: "/ho-tro-giao-duc.jpg" },
    { name: "Phát triển sinh kế", description: "Người dân được hỗ trợ công cụ và kỹ năng để phát triển kinh tế.", image: "/phat-trien-sinh-ke.jpg" },
    { name: "Bảo vệ quyền lợi", description: "Hoạt động tuyên truyền và bảo vệ quyền con người.", image: "/bao-ve-quyen-loi.jpg" },
    { name: "Hỗ trợ môi trường", description: "Tình nguyện viên tham gia trồng cây và làm sạch môi trường.", image: "/ho-tro-moi-truong.jpg" }

  ];

  return (
    <div className="page-container">
      <Header />
      <main className="content-container">
        <section className="content-section">
          <h2 className="title">Chào mừng đến với Tổ chức Nhân đạo</h2>
          <div className="activities-list">
            {activities.map((activity, i) => (
              <div key={i} className="activity-item">
                <img src={activity.image} alt={activity.name} className="activity-image" />
                <div className="activity-content">
                  <h3>{activity.name}</h3>
                  <p>{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
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