import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children, onOpenProfileModal }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-white text-[#0F50A1]">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto md:ml-64">
        <Header setIsSidebarOpen={setIsSidebarOpen} onOpenProfileModal={onOpenProfileModal} />
        <main className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto" style={{overscrollBehavior: 'contain'}}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;