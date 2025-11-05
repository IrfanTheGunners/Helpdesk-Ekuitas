import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import BarChart from '../Components/charts/BarChart';
import initialTickets from '../data/tickets.json';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusCircle, FileText, FolderKanban, MessageCircleMore, Calendar, TrendingUp, Users, Package, AlertCircle } from 'lucide-react';
import { translateStatus } from '../lib/translator';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Komponen Executive Dashboard
const ExecutiveDashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    closedTickets: 0,
    totalUsers: 0,
    agents: 0,
    clients: 0
  });

  useEffect(() => {
    const storedTickets = JSON.parse(localStorage.getItem('tickets')) || [];
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    setTickets(storedTickets);
    
    // Calculate stats
    setStats({
      totalTickets: storedTickets.length,
      openTickets: storedTickets.filter(t => t.status === 'Open').length,
      inProgressTickets: storedTickets.filter(t => t.status === 'In Progress').length,
      closedTickets: storedTickets.filter(t => t.status === 'Closed').length,
      totalUsers: storedUsers.length,
      agents: storedUsers.filter(u => u.role === 'agent').length,
      clients: storedUsers.filter(u => u.role === 'client').length
    });
  }, []);

  // Function to get overdue tickets
  const getOverdueTicketsCount = (ticketsData) => {
    if (!ticketsData || ticketsData.length === 0) return 0;
    
    const now = new Date();
    let count = 0;
    
    ticketsData.forEach(ticket => {
      // Only check open and in-progress tickets
      if (ticket.status !== 'Open' && ticket.status !== 'In Progress') {
        return;
      }
      
      // Calculate SLA based on priority
      const priorityHours = {
        'Tinggi': 1,    // 1 hour
        'Sedang': 0.5,  // 30 minutes
        'Rendah': 0.25  // 15 minutes
      };
      
      const slaHours = priorityHours[ticket.priority] || 1;
      const createdAt = new Date(ticket.createdAt);
      const slaDeadline = new Date(createdAt.getTime() + (slaHours * 60 * 60 * 1000));
      
      // Check if current time exceeds SLA deadline
      if (now > slaDeadline) {
        count++;
      }
    });
    
    return count;
  };

  const overdueTicketsCount = getOverdueTicketsCount(tickets);

  // Stat cards for executive dashboard
  const statCards = [
    { title: 'Total Tiket', value: stats.totalTickets, icon: <Package size={24} className="text-white" />, bgColor: 'bg-blue-600', iconBgColor: 'bg-blue-600', textColor: 'text-gray-800' },
    { title: 'Tiket Terbuka', value: stats.openTickets, icon: <AlertCircle size={24} className="text-white" />, bgColor: 'bg-yellow-100', iconBgColor: 'bg-yellow-500', textColor: 'text-gray-800' },
    { title: 'Sedang Diproses', value: stats.inProgressTickets, icon: <FolderKanban size={24} className="text-white" />, bgColor: 'bg-blue-100', iconBgColor: 'bg-blue-500', textColor: 'text-gray-800' },
    { title: 'Tiket Selesai', value: stats.closedTickets, icon: <FileText size={24} className="text-white" />, bgColor: 'bg-green-100', iconBgColor: 'bg-green-500', textColor: 'text-gray-800' },
    { title: '❌ Tiket Melewati SLA', value: overdueTicketsCount, icon: <AlertCircle size={24} className="text-white" />, bgColor: 'bg-red-100', iconBgColor: 'bg-red-600', textColor: 'text-red-600' },
    { title: 'Total Pengguna', value: stats.totalUsers, icon: <Users size={24} className="text-white" />, bgColor: 'bg-purple-100', iconBgColor: 'bg-purple-500', textColor: 'text-gray-800' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" style={{color: '#5A5858'}}>Dashboard Pimpinan</h1>
        <p className="text-gray-600" style={{color: '#5A5858'}}>Selamat datang kembali, {currentUser?.name || 'Pimpinan'}! Berikut ringkasan kinerja sistem helpdesk.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className={`border border-gray-300 p-4 sm:p-6 rounded-lg shadow-sm ${stat.bgColor || 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{color: '#5A5858'}}>{stat.title}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.textColor || 'text-gray-800'}`}>{stat.value}</p>
              </div>
              <div className={`${stat.iconBgColor || 'bg-blue-600'} p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Executive Reports Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Ticket Distribution by Status */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-300">
          <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2" style={{color: '#5A5858'}}>
            <FileText size={24} style={{color: '#5A5858'}} />
            Distribusi Tiket berdasarkan Status
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Terbuka', value: stats.openTickets },
                  { name: 'Diproses', value: stats.inProgressTickets },
                  { name: 'Selesai', value: stats.closedTickets },
                  { name: 'Overdue', value: overdueTicketsCount }
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#5A5858', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: '#5A5858', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#d1d5db', 
                    borderRadius: '0.5rem',
                    color: '#5A5858'
                  }}
                />
                <Bar dataKey="value" name="Jumlah Tiket">
                  <Cell fill="#3B82F6" /> {/* Blue for Open */}
                  <Cell fill="#F59E0B" /> {/* Yellow for In Progress */}
                  <Cell fill="#10B981" /> {/* Green for Closed */}
                  <Cell fill="#EF4444" /> {/* Red for Overdue */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-300">
          <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2" style={{color: '#5A5858'}}>
            <Users size={24} style={{color: '#5A5858'}} />
            Distribusi Pengguna
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Agent', value: stats.agents },
                  { name: 'Client', value: stats.clients },
                  { name: 'Total', value: stats.totalUsers }
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#5A5858', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: '#5A5858', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#d1d5db', 
                    borderRadius: '0.5rem',
                    color: '#5A5858'
                  }}
                />
                <Bar dataKey="value" name="Jumlah Pengguna">
                  <Cell fill="#8B5CF6" /> {/* Purple for Agents */}
                  <Cell fill="#06B6D4" /> {/* Cyan for Clients */}
                  <Cell fill="#10B981" /> {/* Green for Total */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-300 mt-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2" style={{color: '#5A5858'}}>
          <Calendar size={24} style={{color: '#5A5858'}} />
          Aktivitas Terbaru
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-300 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Package size={20} className="text-blue-600" />
              </div>
              <h3 className="font-medium" style={{color: '#5A5858'}}>Tiket Hari Ini</h3>
            </div>
            <p className="text-2xl font-bold" style={{color: '#5A5858'}}>
              {tickets.filter(t => {
                const today = new Date();
                const ticketDate = new Date(t.createdAt);
                return ticketDate.toDateString() === today.toDateString();
              }).length}
            </p>
          </div>
          <div className="border border-gray-300 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-100 p-2 rounded-full">
                <FileText size={20} className="text-green-600" />
              </div>
              <h3 className="font-medium" style={{color: '#5A5858'}}>Tiket Diselesaikan</h3>
            </div>
            <p className="text-2xl font-bold" style={{color: '#5A5858'}}>
              {tickets.filter(t => {
                const today = new Date();
                const ticketDate = new Date(t.updatedAt || t.createdAt);
                return t.status === 'Closed' && ticketDate.toDateString() === today.toDateString();
              }).length}
            </p>
          </div>
          <div className="border border-gray-300 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <h3 className="font-medium" style={{color: '#5A5858'}}>Tiket Overdue</h3>
            </div>
            <p className="text-2xl font-bold text-red-600">{overdueTicketsCount}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Komponen Admin Dashboard
const AdminDashboard = () => {
  const [stats, setStats] = useState({ 
    totalUsers: 0, 
    totalTickets: 0, 
    openTickets: 0, 
    inProgressTickets: 0,
    closedTickets: 0,
    agents: 0,
    clients: 0
  });
  const [allTickets, setAllTickets] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isSuperAdmin = currentUser?.role === 'superadmin';

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tickets = JSON.parse(localStorage.getItem('tickets')) || initialTickets;
    
    const openTicketsCount = tickets.filter(t => t.status === 'Open').length;
    const inProgressTicketsCount = tickets.filter(t => t.status === 'In Progress').length;
    const closedTicketsCount = tickets.filter(t => t.status === 'Closed').length;
    const agentsCount = users.filter(u => u.role === 'agent').length;
    const clientsCount = users.filter(u => u.role === 'client').length;
    
    setStats({
      totalUsers: users.length,
      totalTickets: tickets.length,
      openTickets: openTicketsCount,
      inProgressTickets: inProgressTicketsCount,
      closedTickets: closedTicketsCount,
      agents: agentsCount,
      clients: clientsCount
    });
    
    // Store tickets in state for use in overdue calculations
    setAllTickets(tickets);
  }, []);



  // Simple function to calculate overdue tickets
  const getOverdueTicketsCount = (ticketsData) => {
    if (!ticketsData || ticketsData.length === 0) return 0;
    
    const now = new Date();
    let count = 0;
    
    ticketsData.forEach(ticket => {
      // Only check open and in-progress tickets
      if (ticket.status !== 'Open' && ticket.status !== 'In Progress') {
        return;
      }
      
      // Calculate SLA based on priority
      const priorityHours = {
        'Tinggi': 1,    // 1 hour
        'Sedang': 0.5,  // 30 minutes
        'Rendah': 0.25  // 15 minutes
      };
      
      const slaHours = priorityHours[ticket.priority] || 1;
      const createdAt = new Date(ticket.createdAt);
      const slaDeadline = new Date(createdAt.getTime() + (slaHours * 60 * 60 * 1000));
      
      // Check if current time exceeds SLA deadline
      if (now > slaDeadline) {
        count++;
      }
    });
    
    return count;
  };

  const overdueTicketsCount = getOverdueTicketsCount(allTickets);

  // Prepare additional stat cards for Super Admin
  let additionalStatCards = [];
  if (isSuperAdmin) {
    additionalStatCards = [
      {
        title: '❌ Tiket Melewati SLA',
        value: overdueTicketsCount,
        icon: <AlertCircle size={24} className="text-white" />,
        bgColor: 'bg-red-100',
        iconBgColor: 'bg-red-600',
        textColor: 'text-red-600'
      }
    ];
  }

  const baseStatCards = [
    { title: 'Total Pengguna', value: stats.totalUsers, icon: <Users size={24} className="text-white" />, bgColor: 'bg-blue-600', iconBgColor: 'bg-blue-600', textColor: 'text-gray-800' },
    { title: 'Total Tiket', value: stats.totalTickets, icon: <Package size={24} className="text-white" />, bgColor: 'bg-blue-100', iconBgColor: 'bg-blue-600', textColor: 'text-gray-800' },
    { title: 'Tiket Terbuka', value: stats.openTickets, icon: <AlertCircle size={24} className="text-white" />, bgColor: 'bg-yellow-100', iconBgColor: 'bg-yellow-500', textColor: 'text-gray-800' },
    { title: 'Jumlah Agent', value: stats.agents, icon: <Users size={24} className="text-white" />, bgColor: 'bg-green-100', iconBgColor: 'bg-green-500', textColor: 'text-gray-800' },
  ];

  const statCards = [...baseStatCards, ...additionalStatCards];

  const handleInitializeSuperAdmin = () => {
    // Only allow initialization if no super admin exists and current user is admin
    if (currentUser?.role !== 'admin') {
      alert('Hanya admin biasa yang bisa menginisialisasi super admin pertama');
      return;
    }
    
    // Check if any super admin already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingSuperAdmin = users.find(u => u.role === 'superadmin');
    
    if (existingSuperAdmin) {
      alert('Super Admin sudah ada');
      return;
    }
    
    if (window.confirm('Anda yakin ingin mengubah akun Anda menjadi Super Admin? Ini hanya bisa dilakukan sekali.')) {
      // Update current user to superadmin
      const updatedUsers = users.map(user => 
        user.id === currentUser.id ? { ...user, role: 'superadmin' } : user
      );
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      alert('Akun Anda sekarang menjadi Super Admin. Harap login ulang.');
      localStorage.removeItem('user'); // Force logout
      window.location.href = '/login'; // Redirect to login
    }
  };

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" style={{color: '#5A5858'}}>
          {isSuperAdmin ? 'Dashboard Super Admin' : 'Dashboard Admin'}
        </h1>
        <p className="text-gray-600" style={{color: '#5A5858'}}>
          {isSuperAdmin 
            ? 'Selamat datang kembali, Super Admin! Berikut ringkasan sistem helpdesk dan kontrol tingkat lanjut.' 
            : 'Selamat datang kembali, Admin! Berikus ringkasan sistem helpdesk.'}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className={`border border-gray-300 p-4 sm:p-6 rounded-lg shadow-sm ${stat.bgColor || 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{color: '#5A5858'}}>{stat.title}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.textColor || 'text-gray-800'}`}>{stat.value}</p>
              </div>
              <div className={`${stat.iconBgColor || 'bg-blue-600'} p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        
        {/* Initialize Super Admin (only for regular admin) */}
        {!isSuperAdmin && currentUser?.role === 'admin' && (
          <div className="border border-gray-300 p-4 sm:p-6 rounded-lg shadow-sm">
            <h2 className="text-lg md:text-xl font-semibold mb-4" style={{color: '#5A5858'}}>Inisialisasi Super Admin</h2>
            <div className="space-y-4">
              <p className="text-sm" style={{color: '#5A5858'}}>Ini adalah akun admin biasa. Anda dapat menginisialisasi akun Super Admin pertama.</p>
              <button 
                onClick={handleInitializeSuperAdmin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
              >
                Jadikan Saya Super Admin
              </button>
              <div className="pt-2 border-t border-gray-300">
                <p className="text-xs" style={{color: '#5A5858'}}>Fitur ini hanya bisa digunakan sekali oleh admin biasa pertama.</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Quick Stats */}
          <div className="border border-gray-300 p-4 sm:p-6 rounded-lg shadow-sm">
            <h2 className="text-lg md:text-xl font-semibold mb-4" style={{color: '#5A5858'}}>Statistik Tambahan</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600" style={{color: '#5A5858'}}>Tiket Sedang Diproses</span>
                <span className="font-medium" style={{color: '#5A5858'}}>{stats.inProgressTickets}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600" style={{color: '#5A5858'}}>Tiket Selesai</span>
                <span className="font-medium" style={{color: '#5A5858'}}>{stats.closedTickets}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600" style={{color: '#5A5858'}}>Jumlah Client</span>
                <span className="font-medium" style={{color: '#5A5858'}}>{stats.clients}</span>
              </div>
              {/* Overdue Tickets Indicator */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-red-600 font-medium">❌ Tiket Melewati SLA</span>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Overdue</span>
                </div>
                <span className="font-bold text-red-600">{overdueTicketsCount}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="border border-gray-300 p-4 sm:p-6 rounded-lg shadow-sm">
            <h2 className="text-lg md:text-xl font-semibold mb-4" style={{color: '#5A5858'}}>Aktivitas Terbaru</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full" style={{color: '#0F50A1'}}>
                  <FileText size={16} style={{color: '#0F50A1'}} />
                </div>
                <div>
                  <p className="text-sm" style={{color: '#5A5858'}}>5 tiket baru hari ini</p>
                  <p className="text-xs text-gray-600" style={{color: '#5A5858'}}>Dari berbagai kategori</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full" style={{color: '#6FD36A'}}>
                  <Users size={16} style={{color: '#6FD36A'}} />
                </div>
                <div>
                  <p className="text-sm" style={{color: '#5A5858'}}>2 pengguna terdaftar</p>
                  <p className="text-xs text-gray-600" style={{color: '#5A5858'}}>Kemarin</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <AlertCircle size={16} style={{color: '#5A5858'}} />
                </div>
                <div>
                  <p className="text-sm" style={{color: '#5A5858'}}>1 tiket penting terbuka</p>
                  <p className="text-xs text-gray-600" style={{color: '#5A5858'}}>Kritikal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overdue Tickets Section - Only for Super Admin */}
      {isSuperAdmin && overdueTicketsCount > 0 && (
        <div className="border border-red-300 p-4 sm:p-6 rounded-lg shadow-sm bg-red-50 mt-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2" style={{color: '#5A5858'}}>
            <AlertCircle size={24} className="text-red-600" />
            ❌ Tiket Melewati SLA (Overdue)
          </h2>
          <p className="text-red-600 mb-4">Ada {overdueTicketsCount} tiket yang melewati batas waktu penyelesaian (SLA).</p>
        </div>
      )}
    </div>
  );
};

// Komponen Laporan Unit
const LaporanUnit = () => {
  const [tickets, setTickets] = useState([]);
  const [reportData, setReportData] = useState({});
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const allTickets = JSON.parse(localStorage.getItem('tickets')) || initialTickets;
    setTickets(allTickets);
    
    // Generate initial report data
    generateReportData(allTickets);
  }, []);

  const generateReportData = (ticketsData) => {
    const categories = [...new Set(ticketsData.map(ticket => ticket.category))];
    const statusCount = { 'Open': 0, 'In Progress': 0, 'Closed': 0 };
    
    // Hitung status per kategori
    const categoryStatus = {};
    categories.forEach(category => {
      categoryStatus[category] = { 'Open': 0, 'In Progress': 0, 'Closed': 0 };
    });
    
    ticketsData.forEach(ticket => {
      statusCount[ticket.status]++;
      if (categoryStatus[ticket.category]) {
        categoryStatus[ticket.category][ticket.status]++;
      }
    });
    
    setReportData({
      categories,
      statusCount,
      categoryStatus,
      totalTickets: ticketsData.length
    });
  };

  const handleFilter = () => {
    if (!dateRange.start || !dateRange.end) {
      // Jika tidak ada filter tanggal, gunakan semua tiket
      const allTickets = JSON.parse(localStorage.getItem('tickets')) || initialTickets;
      generateReportData(allTickets);
      return;
    }
    
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    end.setHours(23, 59, 59, 999); // Akhir hari
    
    const filteredTickets = tickets.filter(ticket => {
      const ticketDate = new Date(ticket.createdAt);
      return ticketDate >= start && ticketDate <= end;
    });
    
    generateReportData(filteredTickets);
  };

  const exportReport = () => {
    // Fungsi sederhana untuk ekspor laporan
    alert('Fungsi export laporan akan diimplementasikan sesuai kebutuhan');
  };

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" style={{color: '#5A5858'}}>Laporan Unit</h1>
        <p className="text-gray-600" style={{color: '#5A5858'}}>Laporan tiket berdasarkan kategori dan status</p>
      </div>

      {/* Filter Section */}
      <div className="border border-gray-300 p-4 sm:p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4" style={{color: '#5A5858'}}>Filter Laporan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-2" style={{color: '#5A5858'}}>Tanggal Awal</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{color: '#5A5858'}}
            />
          </div>
          <div>
            <label className="block text-sm mb-2" style={{color: '#5A5858'}}>Tanggal Akhir</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{color: '#5A5858'}}
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleFilter}
              className="w-full bg-blue-600 font-medium py-2 px-4 rounded-lg focus:outline-none transition duration-300 hover:bg-blue-700"
              style={{color: 'white'}}
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="border border-gray-300 p-4 sm:p-6 rounded-lg shadow-sm">
          <p className="text-gray-600 text-sm" style={{color: '#5A5858'}}>Total Tiket</p>
          <p className="text-2xl font-bold mt-1" style={{color: '#5A5858'}}>{reportData.totalTickets || 0}</p>
        </div>
        <div className="border border-gray-300 p-4 sm:p-6 rounded-lg shadow-sm">
          <p className="text-gray-600 text-sm" style={{color: '#5A5858'}}>Tiket Terbuka</p>
          <p className="text-2xl font-bold mt-1" style={{color: '#5A5858'}}>{reportData.statusCount?.['Open'] || 0}</p>
        </div>
        <div className="border border-gray-300 p-4 sm:p-6 rounded-lg shadow-sm">
          <p className="text-gray-600 text-sm" style={{color: '#5A5858'}}>Sedang Diproses</p>
          <p className="text-2xl font-bold mt-1" style={{color: '#5A5858'}}>{reportData.statusCount?.['In Progress'] || 0}</p>
        </div>
        <div className="border border-gray-300 p-4 sm:p-6 rounded-lg shadow-sm">
          <p className="text-gray-600 text-sm" style={{color: '#5A5858'}}>Selesai</p>
          <p className="text-2xl font-bold mt-1" style={{color: '#5A5858'}}>{reportData.statusCount?.['Closed'] || 0}</p>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="border border-gray-300 p-4 sm:p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold" style={{color: '#5A5858'}}>Distribusi Tiket per Kategori</h2>
          <button 
            onClick={exportReport}
            className="bg-blue-600 text-sm py-1 px-3 rounded-lg hover:bg-blue-700"
            style={{color: 'white'}}
          >
            Export Laporan
          </button>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-600" style={{color: '#5A5858'}}>
          Grafik distribusi tiket per kategori akan ditampilkan di sini
        </div>
      </div>

      {/* Detail Table */}
      <div className="rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-lg md:text-xl font-semibold mb-4 pl-4 pr-4 pt-4" style={{color: '#5A5858'}}>Detail Laporan per Kategori</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2 px-4 text-left" style={{color: '#5A5858'}}>Kategori</th>
                <th className="py-2 px-4 text-center" style={{color: '#5A5858'}}>Terbuka</th>
                <th className="py-2 px-4 text-center" style={{color: '#5A5858'}}>Diproses</th>
                <th className="py-2 px-4 text-center" style={{color: '#5A5858'}}>Selesai</th>
                <th className="py-2 px-4 text-center" style={{color: '#5A5858'}}>Total</th>
              </tr>
            </thead>
            <tbody>
              {reportData.categories?.map((category, index) => (
                <tr key={category} className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                  <td className="py-2 px-4 font-medium" style={{color: '#5A5858'}}>{translateStatus(category)}</td>
                  <td className="py-2 px-4 text-center" style={{color: '#5A5858'}}>
                    <span className="bg-[#5A5858]/20 text-[#5A5858] border border-[#5A5858] px-2 py-1 rounded">{reportData.categoryStatus?.[category]?.['Open'] || 0}</span>
                  </td>
                  <td className="py-2 px-4 text-center" style={{color: '#5A5858'}}>
                    <span className="bg-[#5A5858]/20 text-[#5A5858] border border-[#5A5858] px-2 py-1 rounded">{reportData.categoryStatus?.[category]?.['In Progress'] || 0}</span>
                  </td>
                  <td className="py-2 px-4 text-center" style={{color: '#5A5858'}}>
                    <span className="bg-[#5A5858]/20 text-[#5A5858] border border-[#5A5858] px-2 py-1 rounded">{reportData.categoryStatus?.[category]?.['Closed'] || 0}</span>
                  </td>
                  <td className="py-2 px-4 text-center font-semibold" style={{color: '#5A5858'}}>{Object.values(reportData.categoryStatus?.[category] || {}).reduce((a, b) => a + b, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [stats, setStats] = useState({ open: 0, inProgress: 0, closed: 0 });
  const [recentTickets, setRecentTickets] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);

  useEffect(() => {
    const fetchAndSetData = () => {
      const allTickets = JSON.parse(localStorage.getItem('tickets')) || initialTickets;
      
      if (currentUser.role === 'client') {
        const userTickets = allTickets.filter(t => t.userId === currentUser.id);

        // Calculate stats for client
        const open = userTickets.filter(t => t.status === 'Open').length;
        const inProgress = userTickets.filter(t => t.status === 'In Progress').length;
        const closed = userTickets.filter(t => t.status === 'Closed').length;
        setStats({ open, inProgress, closed });

        // Get recent tickets for client
        const sortedTickets = [...userTickets].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setRecentTickets(sortedTickets.slice(0, 5));
      } else { // Agent view
        // Calculate daily statistics for agent
        const allAgentTickets = [...allTickets];
        
        // Group tickets by date and category
        const dailyData = {};
        const monthlyData = {};
        
        allAgentTickets.forEach(ticket => {
          const date = new Date(ticket.createdAt);
          const dateKey = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
          const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // Format: YYYY-MM
          const category = ticket.category || 'General';
          
          // Filter out unwanted categories
          const unwantedCategories = ['General Inquiry'];
          if (unwantedCategories.includes(category)) {
            return; // Skip this ticket if it belongs to an unwanted category
          }
          
          // For daily data (used in chart), use aggregated total
          const totalCategory = 'Total Tiket';
          if (!dailyData[dateKey]) {
            dailyData[dateKey] = {};
          }
          if (!dailyData[dateKey][totalCategory]) {
            dailyData[dateKey][totalCategory] = 0;
          }
          dailyData[dateKey][totalCategory]++;
          
          // For monthly data (used in summary), preserve original categories
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {};
          }
          if (!monthlyData[monthKey][category]) {
            monthlyData[monthKey][category] = 0;
          }
          monthlyData[monthKey][category]++;
        });
        
        // Convert daily data to array and calculate totals
        const dailyResult = Object.entries(dailyData).map(([date, categories]) => {
          const total = Object.values(categories).reduce((sum, count) => sum + count, 0);
          return {
            date,
            categories,
            total,
            categoriesArray: Object.entries(categories).map(([category, count]) => ({
              category,
              count,
              percentage: total > 0 ? Math.round((count / total) * 100) : 0
            }))
          };
        }).sort((a, b) => a.date.localeCompare(b.date)); // Sort by date
        
        // Convert monthly data to array and calculate totals
        const monthlyResult = Object.entries(monthlyData).map(([month, categories]) => {
          const total = Object.values(categories).reduce((sum, count) => sum + count, 0);
          return {
            month,
            categories,
            total,
            categoriesArray: Object.entries(categories).map(([category, count]) => ({
              category,
              count,
              percentage: total > 0 ? Math.round((count / total) * 100) : 0
            }))
          };
        }).sort((a, b) => a.month.localeCompare(b.month)); // Sort by month
        
        setDailyStats(dailyResult);
        setMonthlySummary(monthlyResult);
      }
    };

    // Initial data fetch
    fetchAndSetData();

    // Set up localStorage event listener for real-time updates
    const handleStorageChange = (e) => {
      if (e.key === 'tickets') {
        fetchAndSetData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Interval to refresh data every minute to ensure time ago is accurate
    const intervalId = setInterval(fetchAndSetData, 60000);

    // Cleanup function to remove event listener and interval
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [currentUser.id, currentUser.role]);

  const chartData = [
    { label: 'Terbuka', value: stats.open },
    { label: 'Dikerjakan', value: stats.inProgress },
    { label: 'Selesai', value: stats.closed },
  ];



  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-[#5A5858]/20 text-[#5A5858]';
      case 'in progress': return 'bg-[#5A5858]/20 text-[#5A5858]';
      case 'closed': return 'bg-[#5A5858]/20 text-[#5A5858]';
      default: return 'bg-[#5A5858]/20 text-[#5A5858]';
    }
  };

  const calculateTimeAgo = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInMs = now - createdDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'baru saja';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} menit lalu`;
    } else if (diffInMinutes < 1440) { // kurang dari 24 jam
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours} jam lalu`;
    } else {
      const diffInDays = Math.floor(diffInMinutes / 1440);
      return `${diffInDays} hari lalu`;
    }
  };

  // Check for executive routes first
  if (currentUser?.role === 'executive') {
    if (location.pathname === '/dashboard' || location.pathname === '/' || location.pathname === '/admin/unit-report') {
      if (location.pathname === '/admin/unit-report') {
        return (
          <DashboardLayout>
            <LaporanUnit />
          </DashboardLayout>
        );
      } else {
        return (
          <DashboardLayout>
            <ExecutiveDashboard />
          </DashboardLayout>
        );
      }
    }
  }
  
  // Check for admin routes (including super admin)
  if (currentUser?.role === 'admin' || currentUser?.role === 'superadmin') {
    if (location.pathname === '/dashboard' || location.pathname === '/') {
      return (
        <DashboardLayout>
          <AdminDashboard />
        </DashboardLayout>
      );
    }
  }

  if (currentUser?.role === 'client') {
    // Client dashboard view (existing view)
    return (
      <DashboardLayout>
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold" style={{color: '#5A5858'}}>Dasboard Anda</h1>
          <p className="text-gray-600" style={{color: '#5A5858'}}>Selamat datang kembali, {currentUser.name}!</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <button onClick={() => navigate('/new-ticket')} className="bg-yellow-400 hover:opacity-90 py-6 px-4 rounded-xl flex items-center gap-4 transition-all duration-300 hover:opacity-90 hover:shadow-lg border border-yellow-400 min-h-24">
            <div className="bg-blue-600 rounded-full p-2 icon-new-ticket">
              <PlusCircle size={24} sm:size={32} style={{color: 'white'}}/>
            </div>
            <div className="text-left">
              <h3 className="font-bold text-base sm:text-lg" style={{color: '#5A5858'}}>Buat Tiket Baru</h3>
              <p className="text-xs sm:text-sm" style={{color: '#5A5858'}}>Laporkan masalah baru.</p>
            </div>
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Left Column: Stats & Actions */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Chart */}
            <div className="border p-6 rounded-xl border border-blue-700 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-lg md:text-xl font-semibold mb-4" style={{color: '#5A5858'}}>Ringkasan Tiket</h2>
              <p className="text-xs sm:text-sm mb-4" style={{color: '#5A5858'}}>Jumlah tiket Anda berdasarkan status saat ini.</p>
              <div className="flex items-center justify-center h-[260px]">
                <BarChart data={chartData} />
              </div>
            </div>
          </div>

          {/* Right Column: Recent Activity - Match height with chart */}
          <div className="lg:col-span-1 border p-5 rounded-xl border border-blue-700 shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg md:text-xl font-semibold mb-4" style={{color: '#5A5858'}}>Aktivitas Terbaru</h2>
            <div className="space-y-3">
              {recentTickets.length > 0 ? recentTickets
                .filter(ticket => {
                  const createdDate = new Date(ticket.createdAt);
                  const now = new Date();
                  const diffInMs = now - createdDate;
                  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
                  return diffInMinutes <= 15; // Hanya tampilkan tiket yang dibuat dalam 15 menit terakhir
                })
                .slice(0, 4)
                .map(ticket => (
                <div key={ticket.id} onClick={() => navigate(`/ticket/${ticket.id}`)} className="p-3 rounded-lg cursor-pointer hover:shadow-sm transition-shadow duration-200 border border-opacity-30 border-blue-700 hover:border-blue-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm md:text-base truncate" style={{color: '#5A5858'}}>{ticket.title}</p>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusBadgeClass(ticket.status)}`}>
                        {translateStatus(ticket.status)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {calculateTimeAgo(ticket.createdAt)}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-xs sm:text-sm text-center py-8" style={{color: '#5A5858'}}>Tidak ada aktivitas terbaru.</p>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  } else if (currentUser?.role === 'agent' || currentUser?.role === 'admin' || currentUser?.role === 'superadmin') {
    // Agent dashboard view (also for admin and superadmin who aren't showing the AdminDashboard)
    return (
      <DashboardLayout>
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold" style={{color: '#5A5858'}}>Dasboard Anda</h1>
          <p className="text-gray-600" style={{color: '#5A5858'}}>Selamat datang kembali, {currentUser.name}!</p>
        </div>

        {/* Quick Actions for Agent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <button onClick={() => navigate('/queue')} className="bg-yellow-400 hover:opacity-90 py-6 px-4 rounded-xl flex items-center gap-4 transition-all duration-300 hover:opacity-90 hover:shadow-lg border border-yellow-400 min-h-24">
            <div className="bg-blue-600 rounded-full p-2 icon-new-ticket">
              <FolderKanban size={24} sm:size={32} style={{color: 'white'}}/>
            </div>
            <div className="text-left">
              <h3 className="font-bold text-base sm:text-lg" style={{color: '#5A5858'}}>Antrian Tiket</h3>
              <p className="text-xs sm:text-sm" style={{color: '#5A5858'}}>Lihat tiket yang menunggu.</p>
            </div>
          </button>
          <button onClick={() => navigate('/tickets')} className="bg-yellow-400 hover:opacity-90 py-6 px-4 rounded-xl flex items-center gap-4 transition-all duration-300 hover:opacity-90 hover:shadow-lg border border-yellow-400 min-h-24">
            <div className="bg-blue-600 rounded-full p-2 icon-new-ticket">
              <FileText size={24} sm:size={32} style={{color: 'white'}}/>
            </div>
            <div className="text-left">
              <h3 className="font-bold text-base sm:text-lg" style={{color: '#5A5858'}}>Lihat Semua Tiket</h3>
              <p className="text-xs sm:text-sm" style={{color: '#5A5858'}}>Tampilkan semua tiket.</p>
            </div>
          </button>
        </div>

        {/* Agent Statistics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Daily Statistics Chart */}
          <div className="lg:col-span-2 border p-4 sm:p-6 rounded-lg border border-blue-700 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={20} style={{color: '#5A5858'}} />
              <h2 className="text-lg md:text-xl font-semibold mb-4" style={{color: '#5A5858'}}>Statistik Harian Tiket</h2>
              <button 
                onClick={() => window.location.reload()} 
                className="ml-auto text-xs bg-blue-600 hover:opacity-90 p-1.5 rounded"
                style={{color: 'white'}}
              >
                Refresh
              </button>
            </div>
            <p className="text-xs sm:text-sm" style={{color: '#5A5858'}}>Distribusi tiket berdasarkan kategori per hari</p>
            
            {dailyStats.length > 0 ? (
              <div className="space-y-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={dailyStats.slice(-30).map(day => ({
                        date: day.date,
                        'Total Tiket': day.total
                      }))}
                      margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]}`;
                        }}
                      />
                      <YAxis 
                        tick={{ fill: '#9CA3AF', fontSize: 10 }} 
                        tickCount={5}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.5rem' }}
                        formatter={(value) => [value, 'Jumlah Tiket']}
                        labelFormatter={(label) => `Tanggal: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="Total Tiket"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                        name="Total Tiket Harian"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Total Tickets Legend */}
                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500"></div>
                    <span className="text-xs theme-text-secondary">Total Tiket Harian</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center theme-text-secondary py-12">Tidak ada data statistik tersedia</div>
            )}
          </div>
          
          {/* Monthly Summary and Top Category */}
          <div className="lg:col-span-1 space-y-6 md:space-y-8">
            <div className="border p-4 sm:p-6 rounded-lg border border-blue-700 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} style={{color: '#5A5858'}} />
                <h2 className="text-lg md:text-xl font-semibold mb-4" style={{color: '#5A5858'}}>Ringkasan Bulanan</h2>
              </div>
              
              {monthlySummary.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {monthlySummary.slice(-5).map((month, index) => (
                      <div key={index} className="p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs" style={{color: '#5A5858'}}>{month.month}</span>
                          <span className="text-sm font-bold" style={{color: '#5A5858'}}>{month.total}</span>
                        </div>
                        <div className="w-full rounded-full h-1.5" style={{backgroundColor: '#D1D5DB'}}>
                          <div 
                            className="h-1.5 rounded-full" 
                            style={{ 
                              backgroundColor: '#5A5858',
                              width: `${Math.min(100, (month.total / Math.max(...monthlySummary.map(m => m.total), 1)) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Total tickets and category breakdown */}
                  <div className="pt-2 border-t border-gray-300">
                    {/* Category breakdown as table */}
                    <div className="mb-2">
                      <h4 className="text-xs font-semibold mb-2" style={{color: '#5A5858'}}>Rincian Kategori:</h4>
                      <div className="rounded-lg overflow-hidden border border-gray-300">
                        <table className="w-full text-xs">
                          <thead className="border border-gray-300 p-2">
                            <tr>
                              <th className="p-2 text-left" style={{color: '#5A5858'}}>Kategori</th>
                              <th className="p-2 text-right" style={{color: '#5A5858'}}>Jumlah</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(
                              monthlySummary.reduce((acc, month) => {
                                for (const [cat, count] of Object.entries(month.categories)) {
                                  if (cat !== 'Total Tiket') { // Exclude the special category we created
                                    acc[cat] = (acc[cat] || 0) + count;
                                  }
                                }
                                return acc;
                              }, {})
                            ).sort((a, b) => b[1] - a[1]).map(([category, count]) => (
                              <tr key={category} className="p-2 border-b hover:opacity-80 border-gray-300">
                                <td className="p-2" style={{color: '#5A5858'}}>{translateStatus(category)}</td>
                                <td className="p-2 text-right font-medium" style={{color: '#5A5858'}}>{count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-2 pt-2 border-t border-gray-300">
                      <span className="text-sm" style={{color: '#5A5858'}}>Total Tiket</span>
                      <span className="text-lg font-bold" style={{color: '#5A5858'}}>
                        {monthlySummary.reduce((sum, month) => sum + month.total, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600" style={{color: '#5A5858'}}>Tidak ada data bulanan tersedia</p>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
};

export default Dashboard;