import React, { useState, useEffect } from 'react';
import { LogOut, User, Search, Bell, Menu, Settings, ShieldCheck, MessageSquare, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationItem from '../NotificationItem';

const Header = ({ setIsSidebarOpen, onOpenProfileModal }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const loadNotifications = () => {
    const allNotifs = JSON.parse(localStorage.getItem('notifications')) || [];
    
    // Filter notifikasi berdasarkan role
    let userNotifs = [];
    if (user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'pimpinan') {
      // Untuk admin, superadmin, dan pimpinan - tampilkan notifikasi sistem dan manajemen
      userNotifs = allNotifs.filter(n => 
        (n.userId === user?.id || n.targetRole === user?.role) && 
        (n.type === 'system' || n.type === 'management' || n.type === 'general')
      ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // Untuk agent dan client - tampilkan notifikasi umum
      userNotifs = allNotifs.filter(n => 
        n.userId === user?.id
      ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setNotifications(userNotifs);
    setUnreadCount(userNotifs.filter(n => !n.isRead).length);
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
    
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
      if(user) loadNotifications();
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event when a notif is created in the same session
    window.addEventListener('notificationsUpdated', loadNotifications);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('notificationsUpdated', loadNotifications);
    }
  }, [user?.id]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleMarkAsRead = (notificationId) => {
    const allNotifs = JSON.parse(localStorage.getItem('notifications')) || [];
    const notifIndex = allNotifs.findIndex(n => n.id === notificationId && 
      (n.userId === user?.id || 
       (['admin', 'superadmin', 'pimpinan'].includes(user?.role) && n.targetRole === user?.role)));
    if (notifIndex !== -1) {
      allNotifs[notifIndex].isRead = true;
      localStorage.setItem('notifications', JSON.stringify(allNotifs));
      loadNotifications(); // Refresh UI
    }
    setIsNotifOpen(false);
  };

  const handleMarkAllAsRead = () => {
    const allNotifs = JSON.parse(localStorage.getItem('notifications')) || [];
    
    // Filter notifikasi berdasarkan role
    let userNotifs = [];
    if (user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'pimpinan') {
      userNotifs = allNotifs.filter(n => 
        (n.userId === user?.id || n.targetRole === user?.role) && 
        (n.type === 'system' || n.type === 'management' || n.type === 'general')
      );
    } else {
      userNotifs = allNotifs.filter(n => n.userId === user?.id);
    }

    // Update all notifications for this user to be read
    const updatedNotifs = allNotifs.map(notif => {
      if (userNotifs.some(userNotif => userNotif.id === notif.id)) {
        return { ...notif, isRead: true };
      }
      return notif;
    });

    localStorage.setItem('notifications', JSON.stringify(updatedNotifs));
    loadNotifications(); // Refresh UI
    setIsNotifOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-menu')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#0F50A1] text-white shadow-md p-4 flex items-center justify-between md:justify-end">
      {/* Hamburger Menu - Mobile Only */}
      <div className="md:hidden">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg hover:bg-[#0F50A1]/80 text-white" aria-label="Open menu">
            <Menu size={24} className="text-white"/>
        </button>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Notification Bell */}
        <div className="relative">
            <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 rounded-lg hover:bg-[#0F50A1]/80 relative text-white" aria-label="Notifications">
                <Bell size={22} className="text-white"/>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">{unreadCount}</span>
                )}
            </button>
            {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 max-w-[90vw] border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto bg-white text-gray-800">
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h4 className="font-semibold text-gray-800">Notifikasi</h4>
                        {notifications.length > 0 && (
                            <button 
                                onClick={handleMarkAllAsRead}
                                className="text-sm px-3 py-1 rounded bg-yellow-400 hover:opacity-90 text-[#0F50A1]"
                            >
                                Baca Semua
                            </button>
                        )}
                    </div>
                    {notifications.length > 0 ? (
                        notifications.map(notif => (
                            <NotificationItem key={notif.id} notification={notif} onRead={handleMarkAsRead} />
                        ))
                    ) : (
                        <p className="p-4 text-sm text-gray-600">Tidak ada notifikasi baru.</p>
                    )}
                </div>
            )}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative profile-menu">
            <button onClick={toggleProfileDropdown} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm p-2 overflow-hidden">
                {user && user.profileImage && user.profileImage !== '/src/assets/default-avatar.svg' && user.profileImage !== '/src/assets/default-avatar.png' && !user.profileImage.startsWith('data:image') ? (
                    <img
                        src={user.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                    />
                ) : (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                        {user ? user.name.charAt(0).toUpperCase() : 'T'}
                    </div>
                )}
            </button>
            {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 border rounded-lg shadow-lg z-50 bg-white">
                <div className="p-2">
                <button 
                    onClick={() => {
                      if (onOpenProfileModal) {
                        onOpenProfileModal();
                      } else {
                        navigate('/profile');
                      }
                      setIsProfileOpen(false); // Close dropdown after clicking
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-black">
                    <User size={16} className="text-black"/>
                    <span>Profil</span>
                </button>
                <button 
                    onClick={() => {
                      handleLogout();
                      setIsProfileOpen(false); // Close dropdown after clicking
                    }} 
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-red-600">
                    <LogOut size={16} className="text-red-600"/>
                    <span>Keluar</span>
                </button>
                </div>
            </div>
            )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;