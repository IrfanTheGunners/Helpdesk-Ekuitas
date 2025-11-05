
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationItem = ({ notification, onRead }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <button 
      onClick={handleClick} 
      className={`w-full text-left p-3 text-sm border-b border-gray-200 hover:bg-gray-100 ${
        !notification.isRead ? 'bg-blue-100' : 'bg-white'
      }`}>
      <p className="text-gray-800">{notification.message}</p>
      <p className="text-xs text-gray-600 mt-1">{new Date(notification.createdAt).toLocaleString('id-ID')}</p>
    </button>
  );
};

export default NotificationItem;
