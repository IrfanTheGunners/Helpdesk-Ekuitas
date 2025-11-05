
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import initialTickets from '../data/tickets.json';
import initialUsers from '../data/users.json';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { translateStatus, translatePriority } from '../lib/translator';
import { Search } from 'lucide-react';

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'open': return 'bg-[#0F50A1]/20 text-[#0F50A1]';
    case 'in progress': return 'bg-[#F6E603]/20 text-[#F6E603]';
    case 'closed': return 'bg-[#6FD36A]/20 text-[#6FD36A]';
    default: return 'bg-gray-500/20 text-gray-300';
  }
};

const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'border-red-500/50 text-red-400';
      case 'medium': return 'border-yellow-500/50 text-yellow-400';
      case 'low': return 'border-green-500/50 text-green-400';
      default: return 'border-gray-500/50 text-gray-400';
    }
  };

const TicketListPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get location object
  const currentUser = JSON.parse(localStorage.getItem('user'));
  
  const [allTickets, setAllTickets] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // This effect now re-runs every time the page location changes
  useEffect(() => {
    const loadedTickets = JSON.parse(localStorage.getItem('tickets')) || initialTickets;
    const loadedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setAllTickets(loadedTickets);
    setUsers(loadedUsers);
  }, [location]); // Dependency on location ensures data re-fetch on navigation

  const isAgent = currentUser?.role === 'agent';

  const filteredTickets = allTickets
    .filter(ticket => isAgent || ticket.userId === currentUser?.id)
    .filter(ticket => {
      if (!searchTerm) return true;
      return ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .filter(ticket => {
      if (statusFilter === 'all') return true;
      return ticket.status === statusFilter;
    })
    .filter(ticket => {
      if (priorityFilter === 'all') return true;
      return ticket.priority === priorityFilter;
    });

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold" style={{color: '#5A5858'}}>{isAgent ? 'Antrian Tiket' : 'Tiket Saya'}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{color: '#5A5858'}} />
            <input 
              type="text" 
              placeholder="Cari berdasarkan judul atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{color: '#5A5858'}}
            />
        </div>
        <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{color: '#5A5858'}}
        >
            <option value="all">Semua Status</option>
            <option value="Open">Terbuka</option>
            <option value="In Progress">Dikerjakan</option>
            <option value="Closed">Selesai</option>
        </select>
        <select 
            value={priorityFilter} 
            onChange={e => setPriorityFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{color: '#5A5858'}}
        >
            <option value="all">Semua Prioritas</option>
            <option value="Low">Rendah</option>
            <option value="Medium">Sedang</option>
            <option value="High">Tinggi</option>
        </select>
      </div>
      
      <div className="theme-table rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="theme-table-header">
              <tr>
                <th className="p-4 font-semibold" style={{color: '#5A5858', backgroundColor: '#f9fafb'}}>Judul</th>
                {isAgent && <th className="p-4 font-semibold" style={{color: '#5A5858', backgroundColor: '#f9fafb'}}>Pembuat</th>}
                <th className="p-4 font-semibold" style={{color: '#5A5858', backgroundColor: '#f9fafb'}}>Kategori</th>
                <th className="p-4 font-semibold" style={{color: '#5A5858', backgroundColor: '#f9fafb'}}>Status</th>
                <th className="p-4 font-semibold" style={{color: '#5A5858', backgroundColor: '#f9fafb'}}>Prioritas</th>
                <th className="p-4 font-semibold" style={{color: '#5A5858', backgroundColor: '#f9fafb'}}>SLA</th>
                <th className="p-4 font-semibold" style={{color: '#5A5858', backgroundColor: '#f9fafb'}}>Update Terakhir</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length > 0 ? filteredTickets.map(ticket => (
                <tr 
                  key={ticket.id} 
                  className="border-t hover:opacity-80 cursor-pointer transition-colors"
                  onClick={() => navigate(`/ticket/${ticket.id}`)}
                  style={{backgroundColor: 'white'}}
                >
                  <td className="p-4" style={{color: '#5A5858'}}>{ticket.title}</td>
                  {isAgent && <td className="p-4" style={{color: '#5A5858'}}>{getUserName(ticket.userId)}</td>}
                  <td className="p-4" style={{color: '#5A5858'}}>{ticket.category || 'N/A'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusBadge(ticket.status)}`} style={{color: '#5A5858'}}>
                      {translateStatus(ticket.status) || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityBadge(ticket.priority)}`} style={{color: '#5A5858'}}>
                        {translatePriority(ticket.priority) || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4">
                    {ticket.priority === 'Tinggi' && (
                      <span className="text-red-400 text-xs" style={{color: 'red'}}>1 jam</span>
                    )}
                    {ticket.priority === 'Sedang' && (
                      <span className="text-yellow-400 text-xs" style={{color: '#fbbf24'}}>30 menit</span>
                    )}
                    {ticket.priority === 'Rendah' && (
                      <span className="text-green-400 text-xs" style={{color: 'green'}}>15 menit</span>
                    )}
                  </td>
                  <td className="p-4" style={{color: '#5A5858'}}>{new Date(ticket.updatedAt).toLocaleDateString('id-ID')}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={isAgent ? 7 : 6} className="text-center p-8" style={{color: '#5A5858', backgroundColor: 'white'}}>
                    Tidak ada tiket yang cocok dengan kriteria Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TicketListPage;
