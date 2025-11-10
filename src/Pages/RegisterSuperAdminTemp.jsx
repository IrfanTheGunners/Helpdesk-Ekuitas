import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const RegisterSuperAdminTemp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [superAdminExists, setSuperAdminExists] = useState(false);
  const navigate = useNavigate();

  // Cek apakah sudah ada superadmin saat komponen dimuat
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingSuperAdmin = users.some(user => user.role === 'superadmin');
    setSuperAdminExists(existingSuperAdmin);
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Validasi input
    if (!name || !email || !password || !confirmPassword) {
      setError('Tolong isi semua kolom.');
      return;
    }

    // Cek panjang password
    if (password.length < 3) {
      setError('Password harus minimal 3 karakter');
      return;
    }

    // Cek apakah konfirmasi password cocok
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok dengan password.');
      return;
    }

    // Ambil data users dari localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Cek apakah sudah ada superadmin (sekali lagi sebagai perlindungan ganda)
    const existingSuperAdmin = users.some(user => user.role === 'superadmin');
    if (existingSuperAdmin) {
      setError('Super Admin sudah ada. Registrasi super admin hanya bisa dilakukan sekali.');
      setSuperAdminExists(true);
      return;
    }

    // Cek apakah email sudah terdaftar
    const existingUser = users.some(user => user.email === email);
    if (existingUser) {
      setError('Email sudah terdaftar. Gunakan email lain.');
      return;
    }

    // Buat user baru dengan role superadmin
    const newSuperAdmin = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      email,
      password,
      profileImage: '/src/assets/default-avatar.png',
      role: 'superadmin'
    };

    // Simpan ke localStorage
    const updatedUsers = [...users, newSuperAdmin];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    alert('Registrasi Super Admin berhasil! Silakan login.');
    navigate('/login');
  };

  // Tampilkan pesan jika superadmin sudah ada
  if (superAdminExists) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#9ED9FF] to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-300 rounded-2xl p-8 shadow-lg text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-red-600 p-3 rounded-lg">
                <Shield size={32} style={{color: 'white'}} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registrasi Super Admin</h2>
            <p className="text-red-600 mb-6">Super Admin sudah terdaftar!</p>
            <p className="text-gray-600 mb-6">Registrasi super admin hanya bisa dilakukan sekali. Jika Anda lupa password, hubungi administrator sistem.</p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-[#0F50A1] hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 shadow-md">
                Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9ED9FF] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-300 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-[#0F50A1] p-3 rounded-lg">
              <Shield size={32} style={{color: 'white'}} />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-2" style={{color: '#5A5858'}}>Register Super Admin</h2>
          <p className="text-center text-gray-600 mb-8" style={{color: '#5A5858'}}>Hanya bisa dilakukan satu kali</p>

          {error && <p className="bg-red-100 text-red-700 text-sm rounded-lg p-3 text-center mb-4">{error}</p>}

          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-bold mb-2" style={{color: '#5A5858'}} htmlFor="name">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} style={{color: '#5A5858'}} />
                </div>
                <input 
                  className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F6E603] focus:border-[#F6E603]" 
                  id="name" 
                  type="text" 
                  placeholder="Nama Super Admin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-bold mb-2" style={{color: '#5A5858'}} htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} style={{color: '#5A5858'}} />
                </div>
                <input 
                  className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F6E603] focus:border-[#F6E603]" 
                  id="email" 
                  type="email" 
                  placeholder="superadmin@contoh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-bold mb-2" style={{color: '#5A5858'}} htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} style={{color: '#5A5858'}} />
                </div>
                <input 
                  className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-10 pr-12 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F6E603] focus:border-[#F6E603]" 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} style={{color: '#5A5858'}} /> : <Eye size={20} style={{color: '#5A5858'}} />}
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-bold mb-2" style={{color: '#5A5858'}} htmlFor="confirmPassword">
                Konfirmasi Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} style={{color: '#5A5858'}} />
                </div>
                <input 
                  className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-10 pr-12 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F6E603] focus:border-[#F6E603]" 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} style={{color: '#5A5858'}} /> : <Eye size={20} style={{color: '#5A5858'}} />}
                </button>
              </div>
            </div>
            <button 
              className="w-full bg-[#F6E603] hover:bg-yellow-300 text-[#0F50A1] font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 shadow-md hover:shadow-lg"
              type="submit">
                Register Super Admin
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-8" style={{color: '#5A5858'}}>
            Sudah punya akun? <a href="/login" className="text-[#1577B6] hover:text-[#0F50A1] font-bold">Masuk</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuperAdminTemp;