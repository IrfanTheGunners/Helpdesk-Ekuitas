
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import initialTickets from '../data/tickets.json';
import initialUsers from '../data/users.json';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { translateStatus, translatePriority } from '../lib/translator';
import { Search } from 'lucide-react';

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'open': return 'bg-[#49B6B0]/20 text-[#49B6B0]';
    case 'in progress': return 'bg-[#1577B6]/20 text-[#1577B6]';
    case 'closed': return 'bg-[#6FD36A]/20 text-[#6FD36A]';
    default: return 'bg-gray-500/20 text-gray-300';
  }
};

const getPriorityBadge = (priority) => {
    const normalizedPriority = priority?.toLowerCase();
    switch (normalizedPriority) {
      case 'high':
      case 'tinggi': return 'border-red-500/50 text-red-400';
      case 'medium':
      case 'sedang': return 'border-yellow-500/50 text-yellow-400';
      case 'low':
      case 'rendah': return 'border-green-500/50 text-green-400';
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
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10; // Jumlah tiket per halaman

  // This effect now re-runs every time the page location changes
  useEffect(() => {
    const loadedTickets = JSON.parse(localStorage.getItem('tickets')) || initialTickets;
    const loadedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setAllTickets(loadedTickets);
    setUsers(loadedUsers);
  }, [location]); // Dependency on location ensures data re-fetch on navigation

  const isAgent = currentUser?.role === 'agent';

  // Helper function to map Indonesian priority values to English for comparison
  const mapPriorityToEnglish = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'rendah': return 'Low';
      case 'sedang': return 'Medium';
      case 'tinggi': return 'High';
      default: return priority; // If already in English format
    }
  };

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
      return mapPriorityToEnglish(ticket.priority) === priorityFilter;
    });

  // Pagination calculations
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
      
      <div className="rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f9fafb]">
              <tr className="border-b border-gray-200">
                <th className="py-4 px-6 font-semibold text-gray-700">ID Tiket</th>
                <th className="py-4 px-6 font-semibold text-gray-700">Judul</th>
                {isAgent && <th className="py-4 px-6 font-semibold text-gray-700">Pembuat</th>}
                <th className="py-4 px-6 font-semibold text-gray-700">Kategori</th>
                <th className="py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="py-4 px-6 font-semibold text-gray-700">Prioritas</th>
                <th className="py-4 px-6 font-semibold text-gray-700">Update Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentTickets.length > 0 ? currentTickets.map(ticket => (
                <tr
                  key={ticket.id}
                  className="hover:bg-gray-50 cursor-pointer shadow-sm hover:shadow-md rounded-lg mx-2"
                  onClick={() => navigate(`/ticket/${ticket.id}`)}
                  style={{backgroundColor: 'white'}}
                >
                  <td className="py-4 px-6 font-medium text-gray-800">#{ticket.id}</td>
                  <td className="py-4 px-6 font-medium text-gray-800 hover:underline">{ticket.title}</td>
                  {isAgent && <td className="py-4 px-6 text-gray-700">{getUserName(ticket.userId)}</td>}
                  <td className="py-4 px-6 text-gray-700">{ticket.category || 'N/A'}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusBadge(ticket.status)}`}>
                      {translateStatus(ticket.status) || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityBadge(ticket.priority)}`}>
                        {translatePriority(ticket.priority) || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-700">{new Date(ticket.updatedAt).toLocaleDateString('id-ID')}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={isAgent ? 8 : 7} className="text-center py-12" style={{backgroundColor: 'white'}}>
                    <div className="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-600">Tidak ada tiket yang cocok dengan kriteria Anda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {filteredTickets.length > ticketsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-gray-600">
            Menampilkan {indexOfFirstTicket + 1}-{Math.min(indexOfLastTicket, filteredTickets.length)} dari {filteredTickets.length} tiket
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Sebelumnya
            </button>
            
            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Show first, last, and nearby pages
              if (
                pageNum === 1 || 
                pageNum === totalPages || 
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                pageNum === currentPage - 2 || 
                pageNum === currentPage + 2
              ) {
                return <span key={i} className="px-4 py-2">...</span>;
              }
              return null;
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TicketListPage;
