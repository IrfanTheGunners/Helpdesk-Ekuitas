
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../Components/layout/DashboardLayout';
import initialTickets from '../data/tickets.json';

const NewTicketPage = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Teknis');
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    // Load available categories from localStorage or use defaults
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || [
      'Teknis',
      'Tagihan', 
      'Umum'
    ];
    setAvailableCategories(storedCategories);
    // Set default category if current category is not in the list
    if (!storedCategories.includes('Teknis')) {
      setCategory(storedCategories[0] || '');
    }
  }, []);
  const [priority, setPriority] = useState('Rendah');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError('Judul dan deskripsi tidak boleh kosong.');
      return;
    }

    let tickets = JSON.parse(localStorage.getItem('tickets'));
    if (!tickets) {
      tickets = initialTickets;
    }

    const newTicket = {
      id: tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1,
      title,
      description,
      status: 'Open',
      priority,
      category,
      userId: currentUser.id,
      agentId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };

    const updatedTickets = [...tickets, newTicket];
    localStorage.setItem('tickets', JSON.stringify(updatedTickets)); // THE MISSING LINE

    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const allNotifs = JSON.parse(localStorage.getItem('notifications')) || [];
    let nextNotifId = (allNotifs.length > 0 ? Math.max(...allNotifs.map(n => n.id)) : 0) + 1;

    // Create notification for the user
    allNotifs.push({
      id: nextNotifId++,
      userId: currentUser.id,
      type: 'general',
      message: `Tiket "${title}" berhasil dibuat.`,
      link: `/ticket/${newTicket.id}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    // Create notifications for all agents
    const agents = allUsers.filter(u => u.role === 'agent');
    agents.forEach(agent => {
      allNotifs.push({
        id: nextNotifId++,
        userId: agent.id,
        type: 'ticket',
        message: `Tiket baru "${title}" dibuat oleh ${currentUser.name}.`,
        link: '/queue', // FIX: Link to the queue for agents
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    });

    // Create notifications for admins about new ticket
    const admins = allUsers.filter(u => u.role === 'admin' || u.role === 'superadmin');
    admins.forEach(admin => {
      allNotifs.push({
        id: nextNotifId++,
        userId: admin.id,
        type: 'management',
        message: `Tiket baru "${title}" dibuat oleh ${currentUser.name}.`,
        link: `/admin/tickets`,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    });

    localStorage.setItem('notifications', JSON.stringify(allNotifs));
    // Dispatch events to notify other components
    window.dispatchEvent(new Event('notificationsUpdated'));
    window.dispatchEvent(new Event('ticketsUpdated'));

    alert('Tiket berhasil dibuat!'); // Keep alert for immediate feedback
    navigate('/tickets'); // Use React Router navigation instead of hard redirect
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Buat Tiket Baru</h1>
      <div className="bg-white border border-gray-300 rounded-lg p-8 max-w-4xl mx-auto shadow-lg hover:shadow-xl">
        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-500/20 text-red-300 text-sm rounded-lg p-3 text-center mb-4">{error}</p>}
          
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2" htmlFor="title" style={{color: '#5A5858'}}>
              Judul Tiket
            </label>
            <input 
              className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md" 
              id="title" 
              type="text" 
              placeholder="Contoh: Tidak bisa login ke aplikasi mobile"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{color: '#5A5858'}}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="category" style={{color: '#5A5858'}}>
                Kategori
              </label>
              <select 
                id="category"
                className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{color: '#5A5858'}}
              >
                {availableCategories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="priority" style={{color: '#5A5858'}}>
                Prioritas
              </label>
              <select 
                id="priority"
                className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{color: '#5A5858'}}
              >
                <option value="Rendah">Rendah</option>
                <option value="Sedang">Sedang</option>
                <option value="Tinggi">Tinggi</option>
              </select>
            </div>
          </div>
          


          <div className="mb-8">
            <label className="block text-sm font-bold mb-2" htmlFor="description" style={{color: '#5A5858'}}>
              Deskripsi Masalah
            </label>
            <textarea 
              className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 h-40 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md" 
              id="description" 
              placeholder="Jelaskan masalah yang Anda hadapi secara detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{color: '#5A5858'}}
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button 
              className="bg-[#F6E603] hover:bg-yellow-300 text-[#0F50A1] font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline shadow-md hover:shadow-lg"
              type="submit">
              Kirim Tiket
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default NewTicketPage;
