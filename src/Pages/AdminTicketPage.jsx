import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Filter, PlusCircle } from 'lucide-react';
import initialTickets from '../data/tickets.json';
import { translateStatus, translateCategory } from '../lib/translator';

const AdminTicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({ status: 'all', category: 'all', assignee: 'all' });
  const [allCategories, setAllCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load categories from localStorage
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || [
      'Teknis',
      'Tagihan', 
      'Umum'
    ];
    setAllCategories(storedCategories);
  }, []);

  useEffect(() => {
    const allTickets = JSON.parse(localStorage.getItem('tickets')) || initialTickets;
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    setTickets(allTickets);
    setUsers(allUsers);
    
    // Filter tiket sesuai filter dan pencarian saat ini
    filterTickets(allTickets, filter, searchTerm);
    
    // Setup event listener untuk update real-time
    const handleStorageChange = (e) => {
      if (e.key === 'tickets') {
        const updatedTickets = JSON.parse(localStorage.getItem('tickets')) || initialTickets;
        setTickets(updatedTickets);
        filterTickets(updatedTickets, filter, searchTerm);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const filterTickets = (ticketsList, filters, search) => {
    let filtered = [...ticketsList];
    
    // Filter berdasarkan pencarian
    if (search) {
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filter berdasarkan status
    if (filters.status !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === filters.status);
    }
    
    // Filter berdasarkan kategori
    if (filters.category !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === filters.category);
    }
    
    // Filter berdasarkan penerima tiket
    if (filters.assignee !== 'all') {
      if (filters.assignee === 'unassigned') {
        filtered = filtered.filter(ticket => !ticket.agentId);
      } else {
        filtered = filtered.filter(ticket => ticket.agentId === parseInt(filters.assignee));
      }
    }
    
    setFilteredTickets(filtered);
  };

  const handleFilterChange = (type, value) => {
    const newFilter = { ...filter, [type]: value };
    setFilter(newFilter);
    filterTickets(tickets, newFilter, searchTerm);
  };

  const handleSearchChange = (e) => {
    const search = e.target.value;
    setSearchTerm(search);
    filterTickets(tickets, filter, search);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return '#49B6B0'; // teal
      case 'in progress': return '#1577B6'; // blue
      case 'closed': return '#6FD36A'; // green
      default: return '#6B7280'; // gray-500
    }
  };

  const getAgentName = (agentId) => {
    const agent = users.find(user => user.id === agentId);
    return agent ? agent.name : 'Belum Ditugaskan';
  };

  const deleteTicket = (ticketId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tiket ini?')) {
      const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
      localStorage.setItem('tickets', JSON.stringify(updatedTickets));
      
      // Update state
      setTickets(updatedTickets);
      filterTickets(updatedTickets, filter, searchTerm);
    }
  };

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isSuperAdmin = currentUser?.role === 'superadmin';
  
  const allPossibleCategories = ['Umum']; // Daftar semua kategori yang mungkin
  const ticketCategories = [...new Set(tickets.map(ticket => ticket.category))].filter(cat => cat);
  const uniqueTicketCategories = [...new Set([...allPossibleCategories, ...ticketCategories])].sort();
  const agents = users.filter(user => user.role === 'agent');
  const regularAdmins = users.filter(user => user.role === 'admin');
  
  const handleRoleChange = (userId, newRole) => {
    if (!isSuperAdmin) {
      alert('Hanya Super Admin yang bisa mengubah peran pengguna');
      return;
    }
    
    if (window.confirm(`Anda yakin ingin mengubah peran pengguna ini menjadi ${newRole}?`)) {
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      );
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers); // Update state
      alert(`Peran pengguna berhasil diubah menjadi ${newRole}`);
    }
  };

  const handleDeleteUser = (userId, userName) => {
    if (!isSuperAdmin) {
      alert('Hanya Super Admin yang bisa menghapus pengguna');
      return;
    }
    
    if (window.confirm(`Anda yakin ingin menghapus pengguna ${userName}?`)) {
      // Prevent deletion of current user
      if (userId === currentUser.id) {
        alert('Tidak bisa menghapus akun Anda sendiri');
        return;
      }
      
      const updatedUsers = users.filter(user => user.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers); // Update state
      alert('Pengguna berhasil dihapus');
    }
  };

  const addCategory = (categoryName) => {
    if (!categoryName.trim()) {
      alert('Nama kategori tidak boleh kosong');
      return;
    }

    if (allCategories.includes(categoryName.trim())) {
      alert('Kategori sudah ada');
      return;
    }

    const updatedCategories = [...allCategories, categoryName.trim()];
    setAllCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  return (
    <DashboardLayout>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" style={{color: '#5A5858'}}>Daftar Tiket</h1>
        <p className="text-gray-600" style={{color: '#5A5858'}}>Kelola semua tiket dalam sistem</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} style={{color: '#5A5858'}} />
            </div>
            <input
              type="text"
              placeholder="Cari judul atau deskripsi tiket..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-gray-50 rounded-lg py-3 pl-10 pr-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5A5858] focus:border-[#5A5858] transition duration-200"
              style={{color: '#5A5858'}}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <select
                value={filter.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 pl-8 pr-8 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5A5858] focus:border-[#5A5858] appearance-none transition duration-200"
                style={{color: '#5A5858'}}
              >
                <option value="all">Status</option>
                <option value="Open">Terbuka</option>
                <option value="In Progress">Diproses</option>
                <option value="Closed">Selesai</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <select
                value={filter.category}
                onChange={(e) => {
                  if (e.target.value === 'add-new') {
                    const categoryName = prompt('Masukkan nama kategori baru:');
                    if (categoryName) {
                      addCategory(categoryName);
                    }
                  } else {
                    handleFilterChange('category', e.target.value);
                  }
                }}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 pl-8 pr-8 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5A5858] focus:border-[#5A5858] appearance-none transition duration-200"
                style={{color: '#5A5858'}}
              >
                <option value="all">Kategori</option>
                {allCategories.map(category => (
                  <option key={category} value={category}>{translateCategory(category)}</option>
                ))}
                <option value="add-new">+ Tambah Kategori Baru</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <select
                value={filter.assignee}
                onChange={(e) => handleFilterChange('assignee', e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 pl-8 pr-8 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5A5858] focus:border-[#5A5858] appearance-none transition duration-200"
                style={{color: '#5A5858'}}
              >
                <option value="all">Agent</option>
                <option value="unassigned">Belum Ditugaskan</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-gray-400">
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm" style={{color: '#5A5858'}}>Total Tiket</p>
              <p className="text-2xl font-bold mt-1" style={{color: '#5A5858'}}>{filteredTickets.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm" style={{color: '#5A5858'}}>Tiket Terbuka</p>
              <p className="text-2xl font-bold mt-1" style={{color: '#5A5858'}}>
                {filteredTickets.filter(t => t.status === 'Open').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm" style={{color: '#5A5858'}}>Sedang Diproses</p>
              <p className="text-2xl font-bold mt-1" style={{color: '#5A5858'}}>
                {filteredTickets.filter(t => t.status === 'In Progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm" style={{color: '#5A5858'}}>Selesai</p>
              <p className="text-2xl font-bold mt-1" style={{color: '#5A5858'}}>
                {filteredTickets.filter(t => t.status === 'Closed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tiket List */}
      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-300 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg md:text-xl font-semibold" style={{color: '#5A5858'}}>Daftar Tiket</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2 px-4 text-left" style={{color: '#5A5858'}}>ID</th>
                <th className="py-2 px-4 text-left" style={{color: '#5A5858'}}>Judul</th>
                <th className="py-2 px-4 text-left" style={{color: '#5A5858'}}>Kategori</th>
                <th className="py-2 px-4 text-left" style={{color: '#5A5858'}}>Status</th>
                <th className="py-2 px-4 text-left" style={{color: '#5A5858'}}>Pengguna</th>
                <th className="py-2 px-4 text-left" style={{color: '#5A5858'}}>Agent</th>
                <th className="py-2 px-4 text-left" style={{color: '#5A5858'}}>Unit</th>
                <th className="py-2 px-4 text-left" style={{color: '#5A5858'}}>Tanggal</th>
                <th className="py-2 px-4 text-center" style={{color: '#5A5858'}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map(ticket => {
                  const user = users.find(u => u.id === ticket.userId);
                  return (
                    <tr 
                      key={ticket.id} 
                      className="border-b border-gray-300 hover:bg-gray-50"
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                      style={{cursor: 'pointer'}}
                    >
                      <td className="py-2 px-4" style={{color: '#5A5858'}}>#{ticket.id}</td>
                      <td 
                        className="py-2 px-4 font-medium hover:underline" 
                        style={{color: '#5A5858'}}
                      >
                        {ticket.title}
                      </td>
                      <td className="py-2 px-4" style={{color: '#5A5858'}}>{translateCategory(ticket.category)}</td>
                      <td className="py-2 px-4">
                        <span className="px-2 py-1 rounded text-xs font-semibold" style={{backgroundColor: getStatusBadge(ticket.status), color: 'white'}}>
                          {translateStatus(ticket.status)}
                        </span>
                      </td>
                      <td className="py-2 px-4" style={{color: '#5A5858'}}>{user ? user.name : 'Tidak Diketahui'}</td>
                      <td className="py-2 px-4" style={{color: '#5A5858'}}>{getAgentName(ticket.agentId)}</td>
                      <td className="py-2 px-4" style={{color: '#5A5858'}}>{ticket.agentId ? (users.find(u => u.id === ticket.agentId)?.unit || 'Unit Tidak Diketahui') : 'Belum Ditugaskan'}</td>
                      <td className="py-2 px-4" style={{color: '#5A5858'}}>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 px-4 text-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); // Mencegah klik baris membuka detail tiket
                            deleteTicket(ticket.id);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1 rounded"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-4 px-4 text-center text-gray-600" style={{color: '#5A5858'}}>
                    Tidak ada tiket yang sesuai dengan filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* User Management Section - Only for Super Admin */}
      {isSuperAdmin && (
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-300 shadow-sm mt-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4" style={{color: '#5A5858'}}>Manajemen Pengguna</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Admin Management */}
            <div>
              <h3 className="font-medium mb-3" style={{color: '#5A5858'}}>Admin Management</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {regularAdmins.map(user => (
                  <div key={user.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium" style={{color: '#5A5858'}}>{user.name}</p>
                      <p className="text-xs text-gray-600" style={{color: '#5A5858'}}>{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="text-xs bg-white border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                        <option value="agent">Agent</option>
                        <option value="client">Client</option>
                      </select>
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
                {regularAdmins.length === 0 && (
                  <p className="text-gray-600 text-sm" style={{color: '#5A5858'}}>Tidak ada admin selain super admin</p>
                )}
              </div>
            </div>
            
            {/* All Users Management */}
            <div>
              <h3 className="font-medium mb-3" style={{color: '#5A5858'}}>Semua Pengguna</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {users.map(user => (
                  <div key={user.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium" style={{color: '#5A5858'}}>{user.name}</p>
                      <p className="text-xs text-gray-600" style={{color: '#5A5858'}}>{user.email} - {user.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="text-xs bg-white border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="client">Client</option>
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                      {user.id !== currentUser.id && (
                        <button 
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="text-xs text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminTicketPage;