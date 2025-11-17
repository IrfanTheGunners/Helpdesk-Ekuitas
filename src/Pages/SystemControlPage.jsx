import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import { Users, Shield, Settings, Database, HardDrive, UserPlus, UserX, AlertTriangle } from 'lucide-react';

const SystemControlPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'client',
    password: '',
    unit: '',
    category: ''
  });
  
  // Fungsi untuk mendapatkan daftar unit unik dari pengguna
  const getUniqueUnits = () => {
    const uniqueUnits = [...new Set(users.map(user => user.unit).filter(unit => unit && unit !== 'Belum Ditentukan' && unit !== 'Unit Tidak Diketahui'))];
    return uniqueUnits;
  };
  
  // Daftar unit yang sudah ada
  const uniqueUnits = getUniqueUnits();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('user-management');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
    
    const usersFromStorage = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(usersFromStorage);
  }, []);

  // Check if current user is super admin
  const isSuperAdmin = currentUser?.role === 'superadmin';
  
  // Show loading state while checking user
  if (currentUser === null) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5A5858] mx-auto"></div>
            <p className="text-gray-600 mt-4" style={{color: '#5A5858'}}>Memeriksa akses...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!isSuperAdmin) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 bg-white border border-red-300 rounded-lg shadow-sm">
            <AlertTriangle size={48} style={{color: 'red'}} className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2" style={{color: '#5A5858'}}>Akses Ditolak</h1>
            <p className="text-gray-600" style={{color: '#5A5858'}}>Hanya Super Admin yang dapat mengakses halaman ini</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleCreateUser = (e) => {
    e.preventDefault();
    
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      alert('Silakan lengkapi semua field');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.email === newUserData.email);
    if (existingUser) {
      alert('Email sudah terdaftar');
      return;
    }

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: newUserData.name,
      email: newUserData.email,
      password: newUserData.password,
      role: newUserData.role,
      unit: newUserData.role !== 'client' ? (newUserData.unit || 'Belum Ditentukan') : 'Belum Ditentukan',
      category: newUserData.role !== 'client' ? (newUserData.category || 'Belum Ditentukan') : 'Belum Ditentukan'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setUsers(users);
    setNewUserData({ name: '', email: '', role: 'client', password: '', unit: '', category: '' });
    alert('Pengguna baru berhasil dibuat');
  };

  const handleUpdateRole = (userId, newRole) => {
    if (window.confirm(`Anda yakin ingin mengubah peran pengguna ini menjadi ${newRole}?`)) {
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      );
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      alert(`Peran pengguna berhasil diubah menjadi ${newRole}`);
    }
  };

  const handleDeleteUser = (userId, userName, userEmail) => {
    // Prevent deletion of current user
    if (userId === currentUser.id) {
      alert('Tidak bisa menghapus akun Anda sendiri');
      return;
    }
    
    if (window.confirm(`Anda yakin ingin menghapus pengguna ${userName} (${userEmail})?`)) {
      const updatedUsers = users.filter(user => user.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      alert('Pengguna berhasil dihapus');
    }
  };

  const handleResetSystem = () => {
    if (window.confirm('Anda yakin ingin mereset seluruh sistem? Tindakan ini tidak bisa dibatalkan.')) {
      if (window.confirm('KONFIRMASI FINAL: Tindakan ini akan menghapus semua data pengguna dan tiket. Lanjutkan?')) {
        // Keep only current super admin user
        const superAdminUser = users.find(u => u.id === currentUser.id && u.role === 'superadmin');
        if (superAdminUser) {
          localStorage.setItem('users', JSON.stringify([superAdminUser]));
          localStorage.setItem('tickets', JSON.stringify([]));
          localStorage.setItem('notifications', JSON.stringify([]));
          setUsers([superAdminUser]);
          alert('Sistem berhasil direset');
          window.location.reload();
        } else {
          alert('Error: Super Admin tidak ditemukan');
        }
      }
    }
  };

  const handleCleanData = () => {
    if (window.confirm('Anda yakin ingin membersihkan data tiket dan notifikasi (tanpa menghapus pengguna)?')) {
      localStorage.setItem('tickets', JSON.stringify([]));
      localStorage.setItem('notifications', JSON.stringify([]));
      alert('Data tiket dan notifikasi telah dibersihkan');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleColors = {
    'client': 'text-blue-400',
    'agent': 'text-yellow-400',
    'admin': 'text-purple-400',
    'superadmin': 'text-red-400'
  };

  return (
    <DashboardLayout>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" style={{color: '#5A5858'}}>System Control</h1>
        <p className="text-gray-600" style={{color: '#5A5858'}}>Kontrol sistem tingkat lanjut untuk Super Admin</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-6 bg-white rounded-t-xl p-2 shadow-sm">
        <button
          className={`py-3 px-6 font-medium rounded-lg transition-all duration-300 ${activeTab === 'user-management' ? 'bg-[#5A5858] text-white shadow-md' : 'text-[#5A5858] hover:bg-gray-100'}`}
          onClick={() => setActiveTab('user-management')}
        >
          <div className="flex items-center gap-2">
            <Users size={18} style={{color: activeTab === 'user-management' ? 'white' : '#5A5858'}} />
            <span style={{color: activeTab === 'user-management' ? 'white' : '#5A5858'}}>Manajemen Pengguna</span>
          </div>
        </button>
        <button
          className={`py-3 px-6 font-medium rounded-lg transition-all duration-300 ${activeTab === 'unit-management' ? 'bg-[#5A5858] text-white shadow-md' : 'text-[#5A5858] hover:bg-gray-100'}`}
          onClick={() => setActiveTab('unit-management')}
        >
          <div className="flex items-center gap-2">
            <Shield size={18} style={{color: activeTab === 'unit-management' ? 'white' : '#5A5858'}} />
            <span style={{color: activeTab === 'unit-management' ? 'white' : '#5A5858'}}>Manajemen Unit</span>
          </div>
        </button>
        <button
          className={`py-3 px-6 font-medium rounded-lg transition-all duration-300 ${activeTab === 'system-tools' ? 'bg-[#5A5858] text-white shadow-md' : 'text-[#5A5858] hover:bg-gray-100'}`}
          onClick={() => setActiveTab('system-tools')}
        >
          <div className="flex items-center gap-2">
            <Settings size={18} style={{color: activeTab === 'system-tools' ? 'white' : '#5A5858'}} />
            <span style={{color: activeTab === 'system-tools' ? 'white' : '#5A5858'}}>Alat Sistem</span>
          </div>
        </button>
      </div>

      {/* User Management Tab */}
      {activeTab === 'user-management' && (
        <div className="space-y-6">
          {/* Create User Form */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{color: '#5A5858'}}>
              <UserPlus size={24} style={{color: '#5A5858'}} />
              Buat Pengguna Baru
            </h2>
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-sm mb-2 font-medium" style={{color: '#5A5858'}}>Nama Lengkap</label>
                <input
                  type="text"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5A5858] focus:border-[#5A5858] transition duration-200"
                  placeholder="Nama pengguna"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-2 font-medium" style={{color: '#5A5858'}}>Email</label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5A5858] focus:border-[#5A5858] transition duration-200"
                  placeholder="email@contoh.com"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-2 font-medium" style={{color: '#5A5858'}}>Password</label>
                <input
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5A5858] focus:border-[#5A5858] transition duration-200"
                  placeholder="Password"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-2 font-medium" style={{color: '#5A5858'}}>Peran</label>
                <div className="relative">
                  <select
                    value={newUserData.role}
                    onChange={(e) => {
                      const selectedRole = e.target.value;
                      if (selectedRole === 'client') {
                        setNewUserData({
                          ...newUserData,
                          role: selectedRole,
                          unit: 'Belum Ditentukan',
                          category: 'Belum Ditentukan'
                        });
                      } else {
                        setNewUserData({...newUserData, role: selectedRole});
                      }
                    }}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5A5858] focus:border-[#5A5858] appearance-none transition duration-200"
                  >
                    <option value="client">Client</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </div>
              </div>
              {newUserData.role !== 'client' && (
                <>
                  <div>
                    <label className="block text-gray-600 text-sm mb-2 font-medium" style={{color: '#5A5858'}}>Unit</label>
                <div className="relative">
                  <select
                    value={newUserData.unit}
                    onChange={(e) => setNewUserData({...newUserData, unit: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5A5858] focus:border-[#5A5858] appearance-none transition duration-200"
                  >
                    <option value="">Pilih Unit</option>
                    <option value="Fakultas Ilmu Komputer">Fakultas Ilmu Komputer</option>
                    <option value="Fakultas Ekonomi">Fakultas Ekonomi</option>
                    <option value="Fakultas Hukum">Fakultas Hukum</option>
                    <option value="Fakultas Teknik">Fakultas Teknik</option>
                    <option value="Fakultas Kedokteran">Fakultas Kedokteran</option>
                    <option value="Bagian Keuangan">Bagian Keuangan</option>
                    <option value="Bagian Kepegawaian">Bagian Kepegawaian</option>
                    <option value="Bagian Administrasi">Bagian Administrasi</option>
                    <option value="Perpustakaan">Perpustakaan</option>
                    <option value="Pusat Laboratorium">Pusat Laboratorium</option>
                    <option value="Pusat Penelitian">Pusat Penelitian</option>
                    <option value="Bagian IT">Bagian IT</option>
                    {uniqueUnits.map((unit, index) => (
                      <option key={index} value={unit}>{unit}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Kategori */}
              <div>
                <label className="block text-gray-600 text-sm mb-2 font-medium" style={{color: '#5A5858'}}>Kategori</label>
                <div className="relative">
                  <select
                    value={newUserData.category}
                    onChange={(e) => setNewUserData({...newUserData, category: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5A5858] focus:border-[#5A5858] appearance-none transition duration-200"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Administrasi">Administrasi</option>
                    <option value="Keuangan">Keuangan</option>
                    <option value="Kepegawaian">Kepegawaian</option>
                    <option value="IT">IT</option>
                    <option value="Penelitian">Penelitian</option>
                    <option value="Kemahasiswaan">Kemahasiswaan</option>
                    <option value="Fasilitas">Fasilitas</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </div>
              </div>
            </>
            )}
            
            <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-[#5A5858] hover:bg-[#4A4848] text-white font-medium py-3 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                >
                  Buat Pengguna
                </button>
              </div>
            </form>
          </div>

          {/* User List */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2" style={{color: '#5A5858'}}>
                <Users size={24} style={{color: '#5A5858'}} />
                Daftar Pengguna
              </h2>
              <div className="mt-2 md:mt-0 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5A5858] focus:border-[#5A5858] transition duration-200"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-300">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-300">
                    <th className="py-3 px-4 text-left font-medium" style={{color: '#5A5858'}}>ID</th>
                    <th className="py-3 px-4 text-left font-medium" style={{color: '#5A5858'}}>Nama</th>
                    <th className="py-3 px-4 text-left font-medium" style={{color: '#5A5858'}}>Email</th>
                    <th className="py-3 px-4 text-left font-medium" style={{color: '#5A5858'}}>Peran</th>
                    <th className="py-3 px-4 text-left font-medium" style={{color: '#5A5858'}}>Unit</th>
                    <th className="py-3 px-4 text-left font-medium" style={{color: '#5A5858'}}>Kategori</th>
                    <th className="py-3 px-4 text-center font-medium" style={{color: '#5A5858'}}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id} className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}>
                      <td className="py-3 px-4 font-mono" style={{color: '#5A5858'}}>#{user.id}</td>
                      <td className="py-3 px-4 font-medium" style={{color: '#5A5858'}}>{user.name}</td>
                      <td className="py-3 px-4 text-gray-600" style={{color: '#5A5858'}}>{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4" style={{color: '#5A5858'}}>{user.unit || 'Belum Ditentukan'}</td>
                      <td className="py-3 px-4" style={{color: '#5A5858'}}>{user.category || 'Belum Ditentukan'}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <div className="relative">
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                              className="text-xs bg-white border border-gray-300 rounded-lg py-1 pl-3 pr-8 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#5A5858] appearance-none"
                            >
                              <option value="client">Client</option>
                              <option value="agent">Agent</option>
                              <option value="admin">Admin</option>
                              <option value="superadmin">Super Admin</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                              </svg>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name, user.email)}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <p className="text-gray-500 text-center py-6">Tidak ada pengguna ditemukan</p>
            )}
          </div>
        </div>
      )}

      {/* Unit Management Tab */}
      {activeTab === 'unit-management' && (
        <div className="space-y-6">
          {/* Create/Edit Unit Form */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{color: '#5A5858'}}>
              <Shield size={24} style={{color: '#5A5858'}} />
              Tambah Unit Baru
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-600 text-sm mb-2 font-medium" style={{color: '#5A5858'}}>Nama Unit</label>
                <div className="relative">
                  <input
                    type="text"
                    value={newUserData.unit}
                    onChange={(e) => setNewUserData({...newUserData, unit: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5A5858] focus:border-[#5A5858] transition duration-200"
                    placeholder="Nama unit baru (misal: Fakultas Ilmu Komputer, Bagian Keuangan, dll)"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="bg-[#5A5858] hover:bg-[#4A4848] text-white font-medium py-2 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                onClick={() => {
                  if (newUserData.unit.trim() === '') {
                    alert('Silakan masukkan nama unit');
                    return;
                  }
                  
                  // Tambah unit ke dalam localStorage 
                  const users = JSON.parse(localStorage.getItem('users')) || [];
                  const hasExistingUser = users.some(user => user.unit === newUserData.unit);
                  
                  if (!hasExistingUser) {
                    // Tambahkan dummy user untuk menyimpan unit
                    const dummyUser = {
                      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                      name: `Dummy - ${newUserData.unit}`,
                      email: `dummy+${newUserData.unit.replace(/\s+/g, '')}@example.com`,
                      password: 'dummy',
                      role: 'client',
                      unit: newUserData.unit
                    };
                    
                    users.push(dummyUser);
                    localStorage.setItem('users', JSON.stringify(users));
                    setUsers(users);
                  }
                  
                  alert(`Unit "${newUserData.unit}" berhasil ditambahkan!`);
                  setNewUserData({...newUserData, unit: ''});
                }}
              >
                Tambahkan Unit
              </button>
            </div>
          </div>

          {/* Unit List */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2" style={{color: '#5A5858'}}>
                <Shield size={24} style={{color: '#5A5858'}} />
                Daftar Unit
              </h2>
              <div className="mt-2 md:mt-0 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cari unit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5A5858] focus:border-[#5A5858] transition duration-200"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-300">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-300">
                    <th className="py-3 px-4 text-left font-medium" style={{color: '#5A5858'}}>ID</th>
                    <th className="py-3 px-4 text-left font-medium" style={{color: '#5A5858'}}>Nama Unit</th>
                    <th className="py-3 px-4 text-center font-medium" style={{color: '#5A5858'}}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(new Set(users.map(user => user.unit).filter(unit => unit))).map((unit, index) => (
                    <tr key={index} className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}>
                      <td className="py-3 px-4 font-mono" style={{color: '#5A5858'}}>{index + 1}</td>
                      <td className="py-3 px-4 font-medium" style={{color: '#5A5858'}}>{unit}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setNewUserData({...newUserData, unit: unit});
                              setActiveTab('user-management');
                              alert('Unit dipilih, Anda bisa membuat pengguna dengan unit ini');
                            }}
                            className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded"
                          >
                            Gunakan
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Anda yakin ingin menghapus unit ${unit}?`)) {
                                // Ini adalah fitur sederhana; dalam aplikasi nyata, Anda mungkin ingin menghapus unit hanya jika tidak ada pengguna yang terdaftar di unit tersebut
                                alert('Fitur ini membutuhkan implementasi server-side untuk keamanan. Dalam aplikasi ini, unit tidak dihapus secara permanen.');
                              }
                            }}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {Array.from(new Set(users.map(user => user.unit).filter(unit => unit))).length === 0 && (
              <p className="text-gray-500 text-center py-6">Tidak ada unit ditemukan</p>
            )}
          </div>
        </div>
      )}

      {/* System Tools Tab */}
      {activeTab === 'system-tools' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Stats */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{color: '#5A5858'}}>
              <Database size={24} style={{color: '#5A5858'}} />
              Statistik Sistem
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users size={18} className="text-blue-600" />
                  </div>
                  <span className="text-gray-600 font-medium" style={{color: '#5A5858'}}>Total Pengguna</span>
                </div>
                <span className="text-xl font-bold" style={{color: '#5A5858'}}>{users.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-gray-600 font-medium" style={{color: '#5A5858'}}>Super Admin</span>
                </div>
                <span className="text-xl font-bold text-red-600">{users.filter(u => u.role === 'superadmin').length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-600 font-medium" style={{color: '#5A5858'}}>Admin</span>
                </div>
                <span className="text-xl font-bold text-purple-600">{users.filter(u => u.role === 'admin').length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-600 font-medium" style={{color: '#5A5858'}}>Agent</span>
                </div>
                <span className="text-xl font-bold text-yellow-600">{users.filter(u => u.role === 'agent').length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-gray-600 font-medium" style={{color: '#5A5858'}}>Client</span>
                </div>
                <span className="text-xl font-bold text-blue-600">{users.filter(u => u.role === 'client').length}</span>
              </div>
            </div>
          </div>

          {/* System Actions */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{color: '#5A5858'}}>
              <Settings size={24} style={{color: '#5A5858'}} />
              Aksi Sistem
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-100 p-1 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                  </div>
                  <h3 className="font-medium" style={{color: '#5A5858'}}>Clean Data</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Hapus semua data tiket dan notifikasi, tetapi simpan data pengguna</p>
                <button
                  onClick={handleCleanData}
                  className="w-full bg-[#5A5858] hover:bg-[#4A4848] text-white py-2 px-4 rounded-lg text-sm transition duration-300 shadow-md hover:shadow-lg"
                >
                  Bersihkan Data
                </button>
              </div>
              
              <div className="p-4 bg-red-50 rounded-xl border border-red-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-red-100 p-1 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-red-600">Reset Sistem</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Hapus semua data (pengguna, tiket, notifikasi) kecuali akun Super Admin ini</p>
                <button
                  onClick={handleResetSystem}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm transition duration-300 shadow-md hover:shadow-lg"
                >
                  Reset Sistem
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SystemControlPage;