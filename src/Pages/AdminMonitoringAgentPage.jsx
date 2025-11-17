import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import initialTickets from '../data/tickets.json';
import { translateStatus } from '../lib/translator';

const AdminMonitoringAgentPage = () => {
  const [tickets, setTickets] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [agentStats, setAgentStats] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('all');

  useEffect(() => {
    const allTickets = JSON.parse(localStorage.getItem('tickets')) || initialTickets;
    const fetchedUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    setTickets(allTickets);
    setAllUsers(fetchedUsers);
    
    // Tambahkan informasi agent ke tiket
    const ticketsWithAgentInfo = allTickets.map(ticket => {
      const agent = fetchedUsers.find(user => user.id === ticket.agentId);
      return {
        ...ticket,
        agentName: agent ? agent.name : 'Belum Ditugaskan',
        agentEmail: agent ? agent.email : 'Belum Ditugaskan'
      };
    });
    
    // Kelompokkan tiket berdasarkan agen
    const agents = fetchedUsers.filter(user => user.role === 'agent');
    const agentData = agents.map(agent => {
      const agentTickets = ticketsWithAgentInfo.filter(ticket => 
        ticket.agentId === agent.id
      );
      return {
        agent: agent,
        tickets: agentTickets,
        openCount: agentTickets.filter(t => t.status === 'Open').length,
        inProgressCount: agentTickets.filter(t => t.status === 'In Progress').length,
        closedCount: agentTickets.filter(t => t.status === 'Closed').length,
        total: agentTickets.length
      };
    });
    
    setAgentStats(agentData);
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return '#3B82F6'; // blue-500
      case 'in progress': return '#F59E0B'; // yellow-500
      case 'closed': return '#10B981'; // green-500
      default: return '#6B7280'; // gray-500
    }
  };

  const filteredAgentStats = selectedAgent === 'all' 
    ? agentStats 
    : agentStats.filter(data => data.agent.id === parseInt(selectedAgent));

  const chartData = filteredAgentStats.map(agentData => ({
    name: agentData.agent.name.split(' ')[0], // Ambil nama depan saja
    'Open': agentData.openCount,
    'In Progress': agentData.inProgressCount,
    'Closed': agentData.closedCount,
    total: agentData.total
  }));

  // Data untuk pie chart status tiket keseluruhan
  const overallTicketStats = tickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {});
  
  const pieData = Object.entries(overallTicketStats).map(([status, count]) => ({
    name: translateStatus(status),
    value: count,
    status: status
  }));

  return (
    <DashboardLayout>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" style={{color: '#5A5858'}}>Monitoring Agent</h1>
        <p className="text-gray-600" style={{color: '#5A5858'}}>Pemantauan kinerja agent dalam menangani tiket</p>
      </div>

      {/* Agent Selection */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-gray-600 text-sm mb-2 font-medium flex items-center gap-2" style={{color: '#5A5858'}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Agent
            </label>
            <div className="relative">
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5A5858] focus:border-[#5A5858] appearance-none"
                style={{color: '#5A5858'}}
              >
                <option value="all">Semua Agent</option>
                {allUsers.filter(user => user.role === 'agent').map(agent => (
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm" style={{color: '#5A5858'}}>Total Agent Aktif</p>
              <p className="text-2xl font-bold mt-1" style={{color: '#5A5858'}}>{agentStats.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="bg-orange-100 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm" style={{color: '#5A5858'}}>Tiket Ditangani</p>
              <p className="text-2xl font-bold mt-1" style={{color: '#5A5858'}}>
                {agentStats.reduce((sum, agent) => sum + agent.total, 0)}
              </p>
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
                {agentStats.reduce((sum, agent) => sum + agent.openCount, 0)}
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
              <p className="text-gray-600 text-sm" style={{color: '#5A5858'}}>Tiket Selesai</p>
              <p className="text-2xl font-bold mt-1" style={{color: '#5A5858'}}>
                {agentStats.reduce((sum, agent) => sum + agent.closedCount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Status per Agent Bar Chart */}
        <div className="bg-white p-3 sm:p-6 rounded-xl shadow-md">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4" style={{color: '#5A5858'}}>Status Tiket per Agent</h2>
          <div className="h-40 sm:h-48 md:h-56 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 15, right: 20, left: 15, bottom: 40 }}
                barSize={15}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#5A5858', fontSize: 10, angle: -45, textAnchor: 'end' }}
                />
                <YAxis 
                  tick={{ fill: '#5A5858', fontSize: 10 }} 
                  tickFormatter={(value) => Math.round(value)}
                  domain={[0, 'dataMax + 1']}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#d1d5db', 
                    borderRadius: '0.5rem',
                    color: '#5A5858'
                  }}
                />
                <Bar dataKey="Open" stackId="a" fill="#3B82F6" name="Terbuka" />
                <Bar dataKey="In Progress" stackId="a" fill="#F59E0B" name="Diproses" />
                <Bar dataKey="Closed" stackId="a" fill="#10B981" name="Selesai" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overall Status Pie Chart */}
        <div className="bg-white p-3 sm:p-6 rounded-xl shadow-md">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4" style={{color: '#5A5858'}}>Distribusi Status Tiket</h2>
          <div className="h-40 sm:h-48 md:h-56 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pieData}
                margin={{ top: 15, right: 20, left: 15, bottom: 40 }}
                barSize={15}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#5A5858', fontSize: 10, angle: -45, textAnchor: 'end' }}
                />
                <YAxis 
                  tick={{ fill: '#5A5858', fontSize: 10 }} 
                  tickFormatter={(value) => Math.round(value)}
                  domain={[0, 'dataMax + 1']}
                  allowDecimals={false}
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
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Agent Details Table */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2" style={{color: '#5A5858'}}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Detail Kinerja Agent
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2 px-4 text-left" style={{color: '#5A5858'}}>Nama Agent</th>
                <th className="py-2 px-4 text-left" style={{color: '#5A5858'}}>Unit</th>
                <th className="py-2 px-4 text-left" style={{color: '#5A5858'}}>Kategori</th>
                <th className="py-2 px-4 text-center" style={{color: '#5A5858'}}>Tiket Terbuka</th>
                <th className="py-2 px-4 text-center" style={{color: '#5A5858'}}>Sedang Diproses</th>
                <th className="py-2 px-4 text-center" style={{color: '#5A5858'}}>Selesai</th>
                <th className="py-2 px-4 text-center" style={{color: '#5A5858'}}>Total Ditangani</th>
                <th className="py-2 px-4 text-center" style={{color: '#5A5858'}}>Tingkat Penyelesaian</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgentStats.map((agentData, index) => {
                const completionRate = agentData.total > 0 
                  ? Math.round((agentData.closedCount / agentData.total) * 100) 
                  : 0;
                
                return (
                  <tr key={agentData.agent.id} className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                    <td className="py-2 px-4 font-medium" style={{color: '#5A5858'}}>{agentData.agent.name}</td>
                    <td className="py-2 px-4 text-center font-semibold" style={{color: '#5A5858'}}>{agentData.openCount}</td>
                    <td className="py-2 px-4 text-center font-semibold" style={{color: '#5A5858'}}>{agentData.inProgressCount}</td>
                    <td className="py-2 px-4 text-center font-semibold" style={{color: '#5A5858'}}>{agentData.closedCount}</td>
                    <td className="py-2 px-4 text-center font-semibold" style={{color: '#5A5858'}}>{agentData.total}</td>
                    <td className="py-2 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-[#5A5858] h-2 rounded-full" 
                            style={{ width: `${completionRate}%` }}
                          ></div>
                        </div>
                        <span style={{color: '#5A5858'}}>{completionRate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminMonitoringAgentPage;