import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // Import ikon mata
import initialUsers from '../data/users.json'; // Load initial users

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State untuk menampilkan/menyembunyikan password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State untuk menampilkan/menyembunyikan konfirmasi password
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
        setError('Tolong isi semua kolom.');
        return;
    }
    
    if (password.length < 3) {
      setError('Password harus minimal 3 karakter');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(u => u.email === email)) {
      setError('Email ini sudah terdaftar. Silakan gunakan email lain.');
      return;
    }

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      email,
      password,
      profileImage: '/src/assets/default-avatar.png', // Default profile image
      role: 'client', // FIX: All new registrations are clients by default
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    alert('Pendaftaran berhasil! Kamu sekarang bisa masuk dengan akun barumu.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col items-center">
            <img
              src="/ekuitas-new.png"
              alt="Logo Ekuitas"
              className="h-16 w-16 mb-4 rounded-full shadow-md"
            />
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Buat Akun Baru</h2>
            <p className="text-center text-gray-500 mb-8">Gabung ke platform Helpdesk</p>
          </div>

          {error && <p className="bg-red-100 text-red-700 text-sm rounded-lg p-3 text-center mb-4">{error}</p>}

          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Nama Lengkap
              </label>
              <input 
                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                id="name" 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input 
                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                id="email" 
                type="email" 
                placeholder="kamu@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input 
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10" 
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
                  {showPassword ? <EyeOff size={20} className="text-gray-500" /> : <Eye size={20} className="text-gray-500" />}
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input 
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10" 
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
                  {showConfirmPassword ? <EyeOff size={20} className="text-gray-500" /> : <Eye size={20} className="text-gray-500" />}
                </button>
              </div>
            </div>
            <button 
              className="w-full bg-[#F6E603] hover:bg-yellow-300 text-[#0F50A1] font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 shadow-md hover:shadow-lg"
              type="submit">
              Buat Akun
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-8">
            Sudah punya akun? <a href="/login" className="text-[#1577B6] hover:text-[#0F50A1] font-bold">Masuk</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;