import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import LocalBarChart from '../Components/charts/BarChart';
import PieChart from '../Components/charts/PieChart';
import initialTickets from '../data/tickets.json';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusCircle, FileText, FolderKanban, MessageCircleMore, Calendar, TrendingUp, Users, Package, AlertCircle } from 'lucide-react';
import { translateStatus } from '../lib/translator';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Bar as RechartsBar, Cell, BarChart as RechartsBarChart } from 'recharts';


// Komponen Dashboard Pimpinan
const PimpinanDashboard = () => {
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



  // Stat cards for pimpinan dashboard
  const statCards = [
    { title: 'Total Tiket', value: stats.totalTickets, icon: <Package size={24} className="text-[#49B6B0]" />, bgColor: 'bg-[#49B6B0]', iconBgColor: 'bg-[#49B6B0]', textColor: 'text-[#49B6B0]' },
    { title: 'Tiket Terbuka', value: stats.openTickets, icon: <AlertCircle size={24} className="text-[#49B6B0]" />, bgColor: 'bg-[#49B6B0]', iconBgColor: 'bg-[#49B6B0]', textColor: 'text-[#49B6B0]' },
    { title: 'Sedang Diproses', value: stats.inProgressTickets, icon: <FolderKanban size={24} className="text-[#1577B6]" />, bgColor: 'bg-[#1577B6]', iconBgColor: 'bg-[#1577B6]', textColor: 'text-[#1577B6]' },
    { title: 'Tiket Selesai', value: stats.closedTickets, icon: <FileText size={24} className="text-[#6FD36A]" />, bgColor: 'bg-[#6FD36A]', iconBgColor: 'bg-[#6FD36A]', textColor: 'text-[#6FD36A]' },
    { title: 'Total Pengguna', value: stats.totalUsers, icon: <Users size={24} className="text-[#0F50A1]" />, bgColor: 'bg-[#0F50A1]', iconBgColor: 'bg-[#0F50A1]', textColor: 'text-[#0F50A1]' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{color: '#5A5858'}}>Dashboard Pimpinan</h1>
          <p className="text-gray-600" style={{color: '#5A5858'}}>Selamat datang kembali, {currentUser?.name || 'Pimpinan'}! Berikut ringkasan kinerja sistem helpdesk.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4" 
               style={{borderLeftColor: 
                 stat.title === 'Total Tiket' || stat.title === 'Tiket Terbuka' ? '#49B6B0' : 
                 stat.title === 'Sedang Diproses' ? '#1577B6' : 
                 stat.title === 'Tiket Selesai' ? '#6FD36A' : 
                 stat.title === 'Total Pengguna' ? '#0F50A1' : '#49B6B0'
               }}>
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-lg mr-3">
                {stat.title === 'Total Tiket' && <Package size={24} className="text-[#49B6B0]" />}
                {stat.title === 'Tiket Terbuka' && <AlertCircle size={24} className="text-[#49B6B0]" />}
                {stat.title === 'Sedang Diproses' && <FolderKanban size={24} className="text-[#1577B6]" />}
                {stat.title === 'Tiket Selesai' && <FileText size={24} className="text-[#6FD36A]" />}
                {stat.title === 'Total Pengguna' && <Users size={24} className="text-[#0F50A1]" />}
              </div>
              <div>
                <p className="text-gray-600 text-sm" style={{color: stat.textColor}}>{stat.title}</p>
                <p className="text-2xl font-bold mt-1" style={{color: stat.textColor}}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Laporan Pimpinan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Ticket Distribution by Status */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-300">
          <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2" style={{color: '#5A5858'}}>
            <FileText size={24} style={{color: '#5A5858'}} />
            Distribusi Tiket berdasarkan Status
          </h2>
          <div className="h-64 min-h-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
              <RechartsBarChart
                data={[
                  { name: 'Terbuka', value: stats.openTickets },
                  { name: 'Diproses', value: stats.inProgressTickets },
                  { name: 'Selesai', value: stats.closedTickets }
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
                <RechartsBar dataKey="value" name="Jumlah Tiket">
                  <Cell key="open" fill="#3B82F6" /> {/* Blue for Open */}
                  <Cell key="inProgress" fill="#F59E0B" /> {/* Yellow for In Progress */}
                  <Cell key="closed" fill="#10B981" /> {/* Green for Closed */}
                </RechartsBar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-300">
          <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2" style={{color: '#5A5858'}}>
            <Users size={24} style={{color: '#5A5858'}} />
            Distribusi Pengguna
          </h2>
          <div className="h-64 min-h-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
              <RechartsBarChart
                data={[
                  { name: 'Agent', value: stats.agents },
                  { name: 'Client', value: stats.clients }
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
                <RechartsBar dataKey="value" name="Jumlah Pengguna">
                  <Cell key="agents" fill="#8B5CF6" /> {/* Purple for Agents */}
                  <Cell key="clients" fill="#06B6D4" /> {/* Cyan for Clients */}
                </RechartsBar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
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





  // Prepare additional stat cards for Super Admin
  let additionalStatCards = [];
  if (isSuperAdmin) {
    additionalStatCards = [
      // Tiket overdue sudah tidak digunakan
    ];
  }

  const baseStatCards = [
    { title: 'Total Pengguna', value: stats.totalUsers, icon: <Users size={24} className="text-[#0F50A1]" />, bgColor: 'bg-[#0F50A1]', iconBgColor: 'bg-[#0F50A1]', textColor: 'text-[#0F50A1]' },
    { title: 'Total Tiket', value: stats.totalTickets, icon: <Package size={24} className="text-[#49B6B0]" />, bgColor: 'bg-[#49B6B0]', iconBgColor: 'bg-[#49B6B0]', textColor: 'text-[#49B6B0]' },
    { title: 'Tiket Terbuka', value: stats.openTickets, icon: <AlertCircle size={24} className="text-[#49B6B0]" />, bgColor: 'bg-[#49B6B0]', iconBgColor: 'bg-[#49B6B0]', textColor: 'text-[#49B6B0]' },
    { title: 'Jumlah Agent', value: stats.agents, icon: <Users size={24} className="text-[#6FD36A]" />, bgColor: 'bg-[#6FD36A]', iconBgColor: 'bg-[#6FD36A]', textColor: 'text-[#6FD36A]' },
  ];

  const statCards = [...baseStatCards, ...additionalStatCards];



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
          <div key={index} className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4" 
               style={{borderLeftColor: 
                 stat.title === 'Total Pengguna' ? '#0F50A1' : 
                 stat.title === 'Total Tiket' || stat.title === 'Tiket Terbuka' ? '#49B6B0' : 
                 stat.title === 'Jumlah Agent' ? '#6FD36A' : '#49B6B0'
               }}>
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-lg mr-3">
                {stat.title === 'Total Pengguna' && <Users size={24} className="text-[#0F50A1]" />}
                {stat.title === 'Total Tiket' && <Package size={24} className="text-[#49B6B0]" />}
                {stat.title === 'Tiket Terbuka' && <AlertCircle size={24} className="text-[#49B6B0]" />}
                {stat.title === 'Jumlah Agent' && <Users size={24} className="text-[#6FD36A]" />}
              </div>
              <div>
                <p className="text-gray-600 text-sm" style={{color: stat.textColor}}>{stat.title}</p>
                <p className="text-2xl font-bold mt-1" style={{color: stat.textColor}}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        

        
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
      

    </div>
  );
};

// Komponen BarChart untuk Status Tiket
const BarChartStatus = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center" style={{color: 'black'}}>Tidak ada data untuk grafik</div>;
  }

  const maxValue = Math.max(...data.map(item => item.value), 1); // Avoid division by zero

  // Gunakan warna dari palette Anda
  const colors = {
    'Terbuka': '#49B6B0',     // Teal dari palette
    'Dikerjakan': '#1577B6',  // Biru sedang dari palette
    'Selesai': '#6FD36A',     // Hijau dari palette
  };

  // Menentukan jumlah garis grid
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="w-full h-full flex p-4 rounded-lg relative" style={{backgroundColor: 'white', border: '1px solid #e5e7eb'}}>
      {/* Y-axis labels (jumlah tiket) */}
      <div className="flex flex-col justify-between items-end pr-2 py-4" style={{height: 'calc(100% - 2rem)'}}>
        <span className="text-xs" style={{color: '#5A5858'}}>{maxValue}</span>
        <span className="text-xs" style={{color: '#5A5858'}}>{Math.round(maxValue * 0.75)}</span>
        <span className="text-xs" style={{color: '#5A5858'}}>{Math.round(maxValue * 0.5)}</span>
        <span className="text-xs" style={{color: '#5A5858'}}>{Math.round(maxValue * 0.25)}</span>
        <span className="text-xs" style={{color: '#5A5858'}}>0</span>
      </div>

      {/* Chart bars with grid lines */}
      <div className="flex-1 flex items-end justify-around pt-4 relative">
        {/* Garis bantu horizontal */}
        {gridLines.map((ratio, idx) => (
          <div
            key={idx}
            className="absolute w-full border-t border-gray-200"
            style={{bottom: `${ratio * 100}%`}}
          ></div>
        ))}
        
        {data.map((item, index) => (
          <div key={index} className="h-full flex flex-col items-center pb-4 relative z-10" style={{width: '30%'}}>
            <div className="flex flex-col items-center justify-end w-full" style={{height: '100%'}}>
              <div
                className="w-3/4 rounded-t-md transition-all duration-500 shadow-md mx-auto"
                style={{
                  height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                  backgroundColor: colors[item.label] || '#5A5858', // Abu-abu dari palette sebagai fallback
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                title={`${item.label}: ${item.value}`}
              ></div>
            </div>
            <span className="text-xs mt-2 font-medium text-center" style={{color: '#5A5858'}}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Komponen Laporan Unit
const LaporanUnit = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [tickets, setTickets] = useState([]);
  const [reportData, setReportData] = useState({
    categories: [],
    statusCount: { 'Open': 0, 'In Progress': 0, 'Closed': 0 },
    categoryStatus: {},
    totalTickets: 0
  });
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    try {
      const allTickets = JSON.parse(localStorage.getItem('tickets')) || initialTickets;
      setTickets(allTickets);
      
      // Generate initial report data
      generateReportData(allTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
      setReportData({
        categories: [],
        statusCount: { 'Open': 0, 'In Progress': 0, 'Closed': 0 },
        categoryStatus: {},
        totalTickets: 0
      });
    }
  }, []);

  const generateReportData = (ticketsData) => {
    try {
      // Pastikan ticketsData adalah array
      if (!Array.isArray(ticketsData)) {
        ticketsData = [];
      }
      
      const categories = [...new Set(ticketsData.map(ticket => ticket?.category).filter(cat => cat))];
      const statusCount = { 'Open': 0, 'In Progress': 0, 'Closed': 0 };
      
      // Hitung status per kategori
      const categoryStatus = {};
      categories.forEach(category => {
        categoryStatus[category] = { 'Open': 0, 'In Progress': 0, 'Closed': 0 };
      });
      
      ticketsData.forEach(ticket => {
        if (ticket?.status) {
          statusCount[ticket.status]++;
          if (categoryStatus[ticket?.category]) {
            categoryStatus[ticket.category][ticket.status]++;
          }
        }
      });
      
      setReportData({
        categories,
        statusCount,
        categoryStatus,
        totalTickets: ticketsData.length
      });
    } catch (error) {
      console.error('Error generating report data:', error);
      setReportData({
        categories: [],
        statusCount: { 'Open': 0, 'In Progress': 0, 'Closed': 0 },
        categoryStatus: {},
        totalTickets: 0
      });
    }
  };

  const handleFilter = () => {
    try {
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
        if (!ticket?.createdAt) return false;
        const ticketDate = new Date(ticket.createdAt);
        return ticketDate >= start && ticketDate <= end;
      });
      
      generateReportData(filteredTickets);
    } catch (error) {
      console.error('Error filtering tickets:', error);
    }
  };

  const exportReport = (format = 'xlsx') => {
    try {
      // Ambil semua tiket yang sesuai dengan filter saat ini
      let filteredTickets = tickets;
      if (dateRange.start && dateRange.end) {
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        end.setHours(23, 59, 59, 999); // Akhir hari
        
        filteredTickets = tickets.filter(ticket => {
          if (!ticket?.createdAt) return false;
          const ticketDate = new Date(ticket.createdAt);
          return ticketDate >= start && ticketDate <= end;
        });
      }

      // Ambil data users untuk mendapatkan nama pembuat dan agent
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Format data untuk tabel Excel
      const reportTitle = [
        [`LAPORAN TIKET - ${new Date().toLocaleDateString('id-ID')}`, '', '', '', '', '', '', '', '', '', '', '', ''],
        ['Periode:', dateRange.start ? new Date(dateRange.start).toLocaleDateString('id-ID') : 'Semua Tanggal', 's/d', dateRange.end ? new Date(dateRange.end).toLocaleDateString('id-ID') : 'Sekarang', '', '', '', '', '', '', '', '', ''],
        [''],
        ['ID Tiket', 'Judul Tiket', 'Deskripsi', 'Kategori', 'Status Tiket', 'Prioritas', 'Nama Pembuat', 'Email Pembuat', 'Ditugaskan ke', 'Tanggal Dibuat', 'Tanggal Diperbarui', 'Tanggal Selesai', 'Durasi (Hari)'],
        // Data rows
        ...filteredTickets.map(ticket => {
          const user = users.find(u => u.id === ticket.userId);
          const agent = users.find(u => u.id === ticket.agentId);
          
          // Cek apakah tiket sudah selesai
          const isCompleted = ticket.status === 'Closed';
          const completionDate = isCompleted ? new Date(ticket.updatedAt).toLocaleDateString('id-ID') : 'Belum Selesai';
          const duration = isCompleted ? Math.ceil((new Date(ticket.updatedAt) - new Date(ticket.createdAt)) / (1000 * 60 * 60 * 24)) : 'Belum Selesai';
          
          return [
            ticket.id,
            ticket.title,
            ticket.description,
            translateStatus(ticket.category) || 'N/A',
            translateStatus(ticket.status) || 'N/A',
            translateStatus(ticket.priority) || 'N/A',
            user?.name || 'N/A',
            user?.email || 'N/A',
            agent?.name || 'Belum Ditugaskan',
            new Date(ticket.createdAt).toLocaleDateString('id-ID'),
            new Date(ticket.updatedAt).toLocaleDateString('id-ID'),
            completionDate,
            duration
          ];
        })
      ];
      
      // Pastikan library xlsx tersedia
      if (typeof window !== 'undefined' && window.XLSX) {
        const XLSX = window.XLSX;
        
        // Buat worksheet dari data
        const worksheet = XLSX.utils.aoa_to_sheet(reportTitle);
        
        // Set lebar kolom agar lebih rapi
        const colWidths = [
          { wch: 10 }, // ID Tiket
          { wch: 30 }, // Judul Tiket
          { wch: 40 }, // Deskripsi
          { wch: 15 }, // Kategori
          { wch: 15 }, // Status Tiket
          { wch: 12 }, // Prioritas
          { wch: 20 }, // Nama Pembuat
          { wch: 25 }, // Email Pembuat
          { wch: 20 }, // Ditugaskan ke
          { wch: 15 }, // Tanggal Dibuat
          { wch: 15 }, // Tanggal Diperbarui
          { wch: 15 }, // Tanggal Selesai
          { wch: 12 }  // Durasi (Hari)
        ];
        worksheet['!cols'] = colWidths;
        
        // Buat workbook dan tambahkan worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Tiket');
        
        // Export file
        const fileName = `laporan-tiket-${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        
        alert(`Laporan berhasil diekspor dalam format Excel. Jumlah tiket: ${filteredTickets.length}`);
      } else {
        // Jika XLSX tidak tersedia, gunakan format CSV sebagai fallback
        console.warn('Library XLSX tidak tersedia, menggunakan format CSV sebagai fallback');
        
        // Format data untuk CSV
        const csvContent = [
          // Header dengan informasi lebih lengkap
          ['ID Tiket', 'Judul Tiket', 'Deskripsi', 'Kategori', 'Status Tiket', 'Prioritas', 'Nama Pembuat', 'Email Pembuat', 'Ditugaskan ke', 'Tanggal Dibuat', 'Tanggal Diperbarui', 'Tanggal Selesai', 'Durasi (Hari)'].join(','),
          ...filteredTickets.map(ticket => {
            const user = users.find(u => u.id === ticket.userId);
            const agent = users.find(u => u.id === ticket.agentId);
            
            // Cek apakah tiket sudah selesai
            const isCompleted = ticket.status === 'Closed';
            const completionDate = isCompleted ? new Date(ticket.updatedAt).toLocaleDateString('id-ID') : 'Belum Selesai';
            const duration = isCompleted ? Math.ceil((new Date(ticket.updatedAt) - new Date(ticket.createdAt)) / (1000 * 60 * 60 * 24)) : 'Belum Selesai';
            
            return [
              ticket.id,
              `"${ticket.title.replace(/"/g, '""')}"`, // Escape quotes
              `"${ticket.description.replace(/"/g, '""')}"`, // Escape quotes
              `"${translateStatus(ticket.category) || 'N/A'}"`,
              `"${translateStatus(ticket.status) || 'N/A'}"`,
              `"${translateStatus(ticket.priority) || 'N/A'}"`,
              `"${user?.name || 'N/A'}"`,
              `"${user?.email || 'N/A'}"`,
              `"${agent?.name || 'Belum Ditugaskan'}"`,
              new Date(ticket.createdAt).toLocaleDateString('id-ID'),
              new Date(ticket.updatedAt).toLocaleDateString('id-ID'),
              completionDate,
              duration
            ].join(',');
          })
        ].join('\n');

        // Buat dan unduh file CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `laporan-tiket-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert(`Laporan berhasil diekspor. Jumlah tiket: ${filteredTickets.length}`);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Terjadi kesalahan saat mengekspor laporan. Silakan coba lagi.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{color: '#5A5858'}}>Laporan Unit</h1>
          <p className="text-gray-600" style={{color: '#5A5858'}}>Laporan tiket berdasarkan kategori dan status</p>
        </div>
        {currentUser?.role === 'pimpinan' && (
          <button
            onClick={() => exportReport('csv')}
            className="bg-green-600 font-medium py-2 px-6 rounded-lg focus:outline-none transition duration-300 hover:bg-green-700 flex items-center justify-center gap-2"
            style={{color: 'white'}}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Ekspor Laporan
          </button>
        )}
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
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4" style={{borderLeftColor: '#49B6B0'}}>
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-lg mr-3">
              <Package size={24} className="text-[#49B6B0]" />
            </div>
            <div>
              <p className="text-gray-600 text-sm" style={{color: '#49B6B0'}}>Total Tiket</p>
              <p className="text-2xl font-bold mt-1" style={{color: '#49B6B0'}}>{reportData.totalTickets || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4" style={{borderLeftColor: '#49B6B0'}}>
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-lg mr-3">
              <AlertCircle size={24} className="text-[#49B6B0]" />
            </div>
            <div>
              <p className="text-gray-600 text-sm" style={{color: '#49B6B0'}}>Tiket Terbuka</p>
              <p className="text-2xl font-bold mt-1" style={{color: '#49B6B0'}}>{reportData.statusCount?.['Open'] || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4" style={{borderLeftColor: '#1577B6'}}>
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-lg mr-3">
              <FolderKanban size={24} className="text-[#1577B6]" />
            </div>
            <div>
              <p className="text-gray-600 text-sm" style={{color: '#1577B6'}}>Sedang Diproses</p>
              <p className="text-2xl font-bold mt-1" style={{color: '#1577B6'}}>{reportData.statusCount?.['In Progress'] || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4" style={{borderLeftColor: '#6FD36A'}}>
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-lg mr-3">
              <FileText size={24} className="text-[#6FD36A]" />
            </div>
            <div>
              <p className="text-gray-600 text-sm" style={{color: '#6FD36A'}}>Selesai</p>
              <p className="text-2xl font-bold mt-1" style={{color: '#6FD36A'}}>{reportData.statusCount?.['Closed'] || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts - Distribusi Status dan Kategori Tiket */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6">
        {/* Chart - Distribusi Status Tiket */}
        <div className="border border-gray-300 p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold" style={{color: '#5A5858'}}>Distribusi Status Tiket</h2>
          </div>
          <div className="h-64">
            {reportData.categories && reportData.categories.length > 0 ? (
              <div className="w-full h-full">
                <BarChartStatus data={[
                  { label: 'Terbuka', value: reportData.statusCount?.['Open'] || 0 },
                  { label: 'Dikerjakan', value: reportData.statusCount?.['In Progress'] || 0 },
                  { label: 'Selesai', value: reportData.statusCount?.['Closed'] || 0 }
                ]} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-600" style={{color: '#5A5858'}}>
                Tidak ada data tiket
              </div>
            )}
          </div>
        </div>
        
        {/* Chart - Distribusi Tiket per Kategori */}
        <div className="border border-gray-300 p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold" style={{color: '#5A5858'}}>Distribusi Tiket per Kategori</h2>
          </div>
          <div className="h-64">
            {reportData.categories && reportData.categories.length > 0 ? (
              <div className="w-full h-full">
                <PieChart data={reportData.categories.map(category => ({
                  label: translateStatus(category),
                  value: Object.values(reportData.categoryStatus?.[category] || {}).reduce((a, b) => a + b, 0)
                }))} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-600" style={{color: '#5A5858'}}>
                Tidak ada data kategori yang tersedia
              </div>
            )}
          </div>
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
              {reportData.categories && reportData.categories.length > 0 ? (
                reportData.categories.map((category, index) => (
                  <tr key={category} className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                    <td className="py-2 px-4 font-medium" style={{color: '#5A5858'}}>{translateStatus(category)}</td>
                    <td className="py-2 px-4 text-center" style={{color: '#5A5858'}}>
                      <span className="bg-[#5A5858]/20 text-[#5A5858] px-2 py-1 rounded">{reportData.categoryStatus?.[category]?.['Open'] || 0}</span>
                    </td>
                    <td className="py-2 px-4 text-center" style={{color: '#5A5858'}}>
                      <span className="bg-[#5A5858]/20 text-[#5A5858] px-2 py-1 rounded">{reportData.categoryStatus?.[category]?.['In Progress'] || 0}</span>
                    </td>
                    <td className="py-2 px-4 text-center" style={{color: '#5A5858'}}>
                      <span className="bg-[#5A5858]/20 text-[#5A5858] px-2 py-1 rounded">{reportData.categoryStatus?.[category]?.['Closed'] || 0}</span>
                    </td>
                    <td className="py-2 px-4 text-center font-semibold" style={{color: '#5A5858'}}>{Object.values(reportData.categoryStatus?.[category] || {}).reduce((a, b) => a + b, 0)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 px-4 text-center text-gray-600" style={{color: '#5A5858'}}>Tidak ada data kategori yang tersedia</td>
                </tr>
              )}
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
      case 'open': return 'bg-[#49B6B0]/20 text-[#49B6B0]';
      case 'in progress': return 'bg-[#1577B6]/20 text-[#1577B6]';
      case 'closed': return 'bg-[#6FD36A]/20 text-[#6FD36A]';
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


  
  // Check for pimpinan routes first
  if (currentUser?.role === 'pimpinan') {
    if (location.pathname === '/dashboard' || location.pathname === '/') {
      return (
        <DashboardLayout>
          <PimpinanDashboard />
        </DashboardLayout>
      );
    }
    if (location.pathname === '/admin/unit-report') {
      return (
        <DashboardLayout>
          <LaporanUnit />
        </DashboardLayout>
      );
    }
  }

  // Check for admin routes (including super admin)
  if (currentUser?.role === 'admin' || currentUser?.role === 'superadmin') {
    // Handle specific paths for admin/superadmin
    if (location.pathname === '/admin/unit-report') {
      return (
        <DashboardLayout>
          <LaporanUnit />
        </DashboardLayout>
      );
    }
    if (location.pathname === '/dashboard' || location.pathname === '/') {
      return (
        <DashboardLayout>
          <AdminDashboard />
        </DashboardLayout>
      );
    }
    // For other routes like /tickets, /queue, continue to agent view
    // This allows admin and superadmin to access ticket queues and other agent features
  }

  if (location.pathname === '/admin/unit-report') {
    // Laporan Unit should be accessible for agent, admin, superadmin, and pimpinan
    if (currentUser?.role === 'agent' || currentUser?.role === 'admin' || currentUser?.role === 'superadmin' || currentUser?.role === 'pimpinan') {
      return (
        <DashboardLayout>
          <LaporanUnit />
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
          <button onClick={() => navigate('/new-ticket')} className="bg-[#F6E603] hover:bg-yellow-300 py-6 px-4 rounded-xl flex items-center gap-4 transition-all duration-300 hover:shadow-lg border border-[#F6E603] min-h-24">
            <div className="bg-[#0F50A1] rounded-full p-2 icon-new-ticket">
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
            <div className="p-6 rounded-xl rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-white">
              <h2 className="text-lg md:text-xl font-semibold mb-4" style={{color: '#5A5858'}}>Ringkasan Tiket</h2>
              <p className="text-xs sm:text-sm mb-4" style={{color: '#5A5858'}}>Jumlah tiket Anda berdasarkan status saat ini.</p>
              <div className="flex items-center justify-center h-[260px]">
                <LocalBarChart data={chartData} />
              </div>
            </div>
          </div>

          {/* Right Column: Recent Activity - Match height with chart */}
          <div className="lg:col-span-1 p-5 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-white">
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
                <div key={ticket.id} onClick={() => navigate(`/ticket/${ticket.id}`)} className="p-3 rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-200 bg-white">
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
    // Also includes specific handling for admin routes
    if ((currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && 
        (location.pathname === '/dashboard' || location.pathname === '/')) {
      return (
        <DashboardLayout>
          <AdminDashboard />
        </DashboardLayout>
      );
    }
    
    return (
      <DashboardLayout>
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold" style={{color: '#5A5858'}}>Dasboard Anda</h1>
          <p className="text-gray-600" style={{color: '#5A5858'}}>Selamat datang kembali, {currentUser.name}!</p>
        </div>

        {/* Recently Assigned Tickets */}
        <div className="mb-6 md:mb-8">
          <div className="p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={20} style={{color: '#5A5858'}} />
              <h2 className="text-lg md:text-xl font-semibold" style={{color: '#5A5858'}}>Tiket Terbaru Saya</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {JSON.parse(localStorage.getItem('tickets'))?.filter(t => t.agentId === currentUser.id)
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 6)
                .map(ticket => {
                  const timeDiff = (new Date() - new Date(ticket.updatedAt)) / (1000 * 60); // Perbedaan waktu dalam menit
                  const shouldShowTime = timeDiff < 10; // Tampilkan waktu hanya jika kurang dari 10 menit

                  // Fungsi untuk menghitung waktu lalu
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

                  return (
                    <div 
                      key={ticket.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer bg-gray-50"
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800 truncate" style={{color: '#5A5858'}}>{ticket.title}</h3>
                        <span className="text-xs text-gray-500">#{ticket.id}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2" style={{color: '#5A5858'}}>{ticket.description?.substring(0, 80)}{ticket.description?.length > 80 ? '...' : ''}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <span className="px-2 py-1 text-xs rounded font-semibold bg-[#49B6B0]/20 text-[#49B6B0]">
                            {translateStatus(ticket.category)}
                          </span>
                          <span className="px-2 py-1 text-xs rounded font-semibold bg-[#1577B6]/20 text-[#1577B6]">
                            {translateStatus(ticket.status)}
                          </span>
                        </div>
                        {shouldShowTime ? (
                          <span className="text-xs text-orange-500 font-medium">
                            {calculateTimeAgo(ticket.updatedAt)}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">
                            {new Date(ticket.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Agent Statistics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Daily Statistics Chart */}
          <div className="lg:col-span-2 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-200">
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
          
          {/* Agent Performance Stats */}
          <div className="lg:col-span-1 space-y-6 md:space-y-8">
            <div className="p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} style={{color: '#5A5858'}} />
                <h2 className="text-lg md:text-xl font-semibold mb-4" style={{color: '#5A5858'}}>Kinerja Saya</h2>
              </div>

              {monthlySummary.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {/* Total assigned tickets */}
                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{color: '#5A5858'}}>Tiket Ditangani</span>
                        <span className="text-lg font-bold" style={{color: '#5A5858'}}>
                          {JSON.parse(localStorage.getItem('tickets'))?.filter(t => t.agentId === currentUser.id).length || 0}
                        </span>
                      </div>
                    </div>

                    {/* Open tickets assigned to me */}
                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{color: '#5A5858'}}>Tiket Terbuka</span>
                        <span className="text-lg font-bold" style={{color: '#5A5858'}}>
                          {JSON.parse(localStorage.getItem('tickets'))?.filter(t => t.agentId === currentUser.id && t.status === 'Open').length || 0}
                        </span>
                      </div>
                    </div>

                    {/* In progress tickets */}
                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{color: '#5A5858'}}>Sedang Diproses</span>
                        <span className="text-lg font-bold" style={{color: '#5A5858'}}>
                          {JSON.parse(localStorage.getItem('tickets'))?.filter(t => t.agentId === currentUser.id && t.status === 'In Progress').length || 0}
                        </span>
                      </div>
                    </div>

                    {/* Completed tickets */}
                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{color: '#5A5858'}}>Tiket Selesai</span>
                        <span className="text-lg font-bold" style={{color: '#5A5858'}}>
                          {JSON.parse(localStorage.getItem('tickets'))?.filter(t => t.agentId === currentUser.id && t.status === 'Closed').length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    {/* Progress breakdown */}
                    <div className="flex justify-between mt-2">
                      <span className="text-sm" style={{color: '#5A5858'}}>Kinerja</span>
                      <span className="text-lg font-bold" style={{color: '#5A5858'}}>
                        {JSON.parse(localStorage.getItem('tickets'))?.filter(t => t.agentId === currentUser.id).length > 0 
                          ? Math.round((JSON.parse(localStorage.getItem('tickets'))?.filter(t => t.agentId === currentUser.id && t.status === 'Closed').length / 
                               JSON.parse(localStorage.getItem('tickets'))?.filter(t => t.agentId === currentUser.id).length) * 100) + '%' 
                          : '0%'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600" style={{color: '#5A5858'}}>Tidak ada data kinerja tersedia</p>
              )}
            </div>
          </div>
        </div>


      </DashboardLayout>
    );
  } else if (currentUser?.role === 'admin' || currentUser?.role === 'superadmin') {
    // Show AdminDashboard for admin/superadmin on default routes if they're not agent
    if (location.pathname === '/dashboard' || location.pathname === '/') {
      return (
        <DashboardLayout>
          <AdminDashboard />
        </DashboardLayout>
      );
    }
  }
  
  // Default return in case none of the conditions are met
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <p className="text-xl text-gray-600">Akses ditolak atau tidak ditemukan</p>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;