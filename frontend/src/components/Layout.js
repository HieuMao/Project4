import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import '../App.css';

const Layout = ({ user }) => {
  const location = useLocation();
  const isVolunteerArea = location.pathname.startsWith('/volunteer');

  return (
    <div className="page-container" style={{ backgroundColor: '#e6f3ff', minHeight: '100vh' }}>
      {!isVolunteerArea && <Header user={user} />}
      <main className="content-container">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;