import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Shield, Lock, Eye, EyeOff } from 'lucide-react';

const RegisterSuperAdminPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      setError('Password harus minimal 6 karakter');
      return;
    }

    try {
      // Ambil data users dari localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Cek apakah email sudah terdaftar
      const existingUser = users.find(user => user.email === formData.email);
      if (existingUser) {
        setError('Email sudah terdaftar');
        return;
      }
      
      // Cek apakah sudah ada super admin
      const existingSuperAdmin = users.find(user => user.role === 'superadmin');
      if (existingSuperAdmin) {
        setError('Super Admin sudah ada. Hanya satu Super Admin yang diperbolehkan.');
        return;
      }

      // Tambahkan user baru dengan role superadmin
      const newSuperAdmin = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name: formData.email.split('@')[0], // Gunakan nama dari email
        email: formData.email,
        password: formData.password,
        profileImage: '/src/assets/default-avatar.png', // Default profile image
        role: 'superadmin' // Role superadmin
      };

      users.push(newSuperAdmin);
      localStorage.setItem('users', JSON.stringify(users));

      setSuccess(true);
      setError('');

      // Redirect setelah 2 detik
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Terjadi kesalahan saat mendaftar');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9ED9FF] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {!success ? (
          <div className="bg-white border border-gray-300 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-[#5A5858] p-3 rounded-lg">
                <Shield size={32} style={{color: 'white'}} />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-center" style={{color: '#5A5858'}} mb-2>Register Super Admin</h2>
            <p className="text-center text-gray-600 mb-8" style={{color: '#5A5858'}}>Buat akun super admin untuk akses penuh</p>
            
            {error && (
              <div className="bg-red-100 text-red-700 text-sm rounded-lg p-3 text-center mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-bold mb-2" style={{color: '#5A5858'}} htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={20} style={{color: '#5A5858'}} />
                  </div>
                  <input
                    className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5A5858] focus:border-[#5A5858]"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="superadmin@contoh.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-600 text-sm font-bold mb-2" style={{color: '#5A5858'}} htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} style={{color: '#5A5858'}} />
                  </div>
                  <input
                    className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-10 pr-12 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5A5858] focus:border-[#5A5858]"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
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
              
              <button
                className="w-full bg-[#5A5858] hover:bg-[#4A4848] text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A5858]/50 transition duration-300"
                type="submit"
              >
                Register Super Admin
              </button>
            </form>

            <p className="text-center text-gray-600 text-sm mt-8" style={{color: '#5A5858'}}>
              Sudah punya akun?{' '}
              <a href="/login" className="text-[#5A5858] hover:text-[#4A4848] font-bold">
                Login di sini
              </a>
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-300 rounded-2xl p-8 shadow-lg text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-green-600 p-3 rounded-lg">
                <Shield size={32} style={{color: 'white'}} />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{color: '#5A5858'}}>Registrasi Berhasil!</h2>
            <p className="text-gray-600 mb-6" style={{color: '#5A5858'}}>Akun super admin Anda telah dibuat. Anda akan diarahkan ke halaman login.</p>
            <div className="w-8 h-8 border-4 border-[#5A5858] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterSuperAdminPage;