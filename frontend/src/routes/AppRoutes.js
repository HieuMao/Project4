import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserList from '../pages/Admin/UserList';


function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/users" element={<UserList />} />
         <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
