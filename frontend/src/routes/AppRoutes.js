import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserList from '../pages/Admin/UserList';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/users" element={<UserList />} />
        {/* Các route khác */}
      </Routes>
    </Router>
  );
}

export default AppRoutes;
