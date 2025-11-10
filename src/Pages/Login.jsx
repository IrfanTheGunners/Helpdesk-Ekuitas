import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // Import ikon mata
import initialUsers from '../data/users.json'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State untuk menampilkan/menyembunyikan password
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Add a fallback to an empty array to prevent crash if localStorage is empty
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } else {
      setError('Email atau password salah');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col items-center">
            <img
              src="/ekuitas-new.png"
              alt="Logo Ekuitas"
              className="h-16 w-16 mb-4 rounded-full shadow-md"
            />
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Selamat Datang di Helpdesk</h2>
            <p className="text-center text-gray-600 mb-8">Masuk ke akun Anda untuk melanjutkan</p>
          </div>
          
          {error && <p className="bg-red-100 text-red-700 text-sm rounded-lg p-3 text-center mb-4">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input 
                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                id="email" 
                type="email" 
                placeholder="kamu@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input 
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10" 
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
            <div className="flex items-center justify-between mb-6">
              <a href="#" className="text-sm text-[#1577B6] hover:text-[#0F50A1]">Lupa Password?</a>
            </div>
            <button 
              className="w-full bg-[#F6E603] hover:bg-yellow-300 text-[#0F50A1] font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 shadow-md hover:shadow-lg"
              type="submit">
              Masuk
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-8">
            Belum punya akun? <a href="/register" className="text-[#1577B6] hover:text-[#0F50A1] font-bold">Daftar di sini</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;