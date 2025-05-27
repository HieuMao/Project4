import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import UserList from '../pages/Admin/UserList';
import ProtectedRoute from '../components/ProtectedRoute';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Chỉ admin mới được truy cập */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute element={UserList} allowedRoles={['admin']} />
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
