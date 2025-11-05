import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, PlusCircle, LifeBuoy, X, FileText, FolderKanban, MessageCircleMore, Shield } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const clientLinks = [
    { icon: <LayoutDashboard size={20} />, name: 'Dasboard', path: '/dashboard' },
    { icon: <FileText size={20} />, name: 'Tiket Saya', path: '/tickets' },
    { icon: <LifeBuoy size={20} />, name: 'Pusat Bantuan', path: '/kb' },
  ];

  const agentLinks = [
    { icon: <LayoutDashboard size={20} />, name: 'Dasboard', path: '/dashboard' },
    { icon: <FolderKanban size={20} />, name: 'Antrian Tiket', path: '/queue' },
  ];

  const adminLinks = [
    { icon: <LayoutDashboard size={20} />, name: 'Dashboard', path: '/dashboard' },
    { icon: <FileText size={20} />, name: 'Tiket', path: '/admin/tickets' },
    { icon: <MessageCircleMore size={20} />, name: 'Monitoring Agent', path: '/admin/monitoring-agent' },
    { icon: <FileText size={20} />, name: 'Laporan Unit', path: '/admin/unit-report' },
  ];
  
  const superAdminLinks = [
    { icon: <LayoutDashboard size={20} />, name: 'Dashboard', path: '/dashboard' },
    { icon: <FileText size={20} />, name: 'Tiket', path: '/admin/tickets' },
    { icon: <MessageCircleMore size={20} />, name: 'Monitoring Agent', path: '/admin/monitoring-agent' },
    { icon: <FileText size={20} />, name: 'Laporan Unit', path: '/admin/unit-report' },
    { icon: <Shield size={20} />, name: 'System Control', path: '/admin/system-control' },
  ];

  const navLinks = user?.role === 'agent' ? agentLinks : user?.role === 'admin' ? adminLinks : user?.role === 'superadmin' ? superAdminLinks : clientLinks;

  return (
    <>
        <style>{`
          a.active svg {
            color: #000000 !important;
          }
        `}</style>
        
        {/* Overlay for mobile */}
        <div 
            onClick={() => setIsSidebarOpen(false)}
            className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        />

        <aside className={`

fixed inset-y-0 left-0 w-64 max-w-[80%] bg-[#0F50A1] text-white flex flex-col transform transition-transform duration-300 ease-in-out z-50 h-screen ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Logo and Close button */}
        <div className="p-4 md:p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                     <img
              src="/src/assets/ekuitas-new.png"
              alt="Logo Ekuitas"
              className="h-8 w-8 shadow-lg rounded-full"
            />
                </div>
                <h1 className="text-xl font-bold text-white">Helpdesk</h1>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="md:hidden text-white"
              aria-label="Close sidebar"
            >
                <X size={24} className="text-white"/>
            </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto">
            <ul>
            {navLinks.map((link) => (
                <li key={link.name}>
                <NavLink
                    to={link.path}
                    onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click
                    className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${
                        isActive
                        ? 'bg-white text-black'
                        : 'hover:bg-gray-200/50 text-white'
                    }`}
                >
                    <span>{link.icon}</span>
                    <span className="truncate">{link.name}</span>
                </NavLink>
                </li>
            ))}
            </ul>
        </nav>
        

        </aside>
    </>
  );
};

export default Sidebar;