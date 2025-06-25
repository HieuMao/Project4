import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Introduction from './pages/Introduction';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPage from './pages/AdminPage';
import StaffPage from './pages/StaffPage';
import ActivityList from './pages/Activities/ActivityList';
import VolunteerPage from './pages/Volunteer/VolunteerPage';
import UserProfile from './pages/Volunteer/UserProfile';
import DonorsList from './pages/Donate/DonorsList';
import Donate from './pages/Donate';

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

function ProtectedRoute({ children, allowedRoles }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role || null;

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (allowedRoles && !allowedRoles.includes(userRole)) {
      navigate('/');
    }
  }, [token, userRole, navigate, allowedRoles]);

  return token && (!allowedRoles || allowedRoles.includes(userRole)) ? children : null;
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role || null;

  // Ẩn header trong admin hoặc volunteer
  const isHiddenHeader = location.pathname.startsWith('/volunteer') || location.pathname.startsWith('/admin');

  useEffect(() => {
    if (token && location.pathname === '/') {
      switch (userRole) {
        case 'admin':
          navigate('/admin');
          break;
        case 'volunteer':
          navigate('/');
          break;
        case 'staff':
          navigate('/staff');
          break;
        default:
          break;
      }
    }
  }, [token, userRole, navigate, location.pathname]);

  const activitiesMode = userRole === 'admin' ? 'admin' : 'view';

  return (
    <div className="page-container">
      {!isHiddenHeader && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/introduction" element={<Introduction />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/donors" element={<DonorsList />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activities" element={<ActivityList mode={activitiesMode} />} /> {/* Public route */}
        <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute allowedRoles={['staff']}><StaffPage /></ProtectedRoute>} />
        <Route path="/volunteer/*" element={<ProtectedRoute allowedRoles={['volunteer']}><VolunteerPage /></ProtectedRoute>} />
        <Route path="/volunteer/donate" element={<ProtectedRoute allowedRoles={['volunteer']}><Donate /></ProtectedRoute>} />
        <Route path="/volunteer/donors" element={<ProtectedRoute allowedRoles={['volunteer']}><DonorsList /></ProtectedRoute>} />
        <Route path="/volunteer/account" element={<UserProfile />} />
      </Routes>
    </div>
  );
}

export default App;