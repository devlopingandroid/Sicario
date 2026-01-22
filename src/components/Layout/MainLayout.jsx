import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className="h-screen flex overflow-hidden bg-forensic-charcoal">
      
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Fixed Header */}
        <Header />

        {/* Scrollable Dashboard Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default MainLayout;
