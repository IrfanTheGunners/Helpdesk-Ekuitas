import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// This is a separate, non-public registration page for agents.
const AgentRegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
        setError('Tolong isi semua kolom.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(u => u.email === email)) {
      setError('Email ini sudah terdaftar. Silakan gunakan email lain.');
      return;
    }

    // Create new user with 'agent' role
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      email,
      password,
      profileImage: '/src/assets/default-avatar.png', // Default profile image
      role: 'agent', // Hardcoded to agent
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    alert('Akun Agen berhasil dibuat! Anda sekarang bisa masuk.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 border border-yellow-500/50 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-white mb-2">Registrasi Agen Baru</h2>
          <p className="text-center text-gray-400 mb-8">Halaman ini hanya untuk pendaftaran agen.</p>

          {error && <p className="bg-red-500/20 text-red-300 text-sm rounded-lg p-3 text-center mb-4">{error}</p>}

          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="name">
                Nama Lengkap Agen
              </label>
              <input 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                id="name" 
                type="text" 
                placeholder="Nama Agen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
                Email Agen
              </label>
              <input 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                id="email" 
                type="email" 
                placeholder="agen@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
              type="submit">
              Daftarkan Agen
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgentRegisterPage;
