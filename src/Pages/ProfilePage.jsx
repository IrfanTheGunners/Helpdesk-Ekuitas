
import React, { useState, useRef } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));

  const [name, setName] = useState(currentUser.name);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileImage, setProfileImage] = useState(currentUser.profileImage || '/src/assets/default-avatar.svg');
  const fileInputRef = useRef(null);

  const handleUpdate = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (password && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Password baru tidak cocok.' });
      return;
    }


    const loggedInUserSession = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUserSession) {
        setMessage({ type: 'error', text: 'Sesi Anda tidak valid. Silakan login ulang.' });
        return;
    }

    let allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = allUsers.findIndex(u => u.id === loggedInUserSession.id);

    if (userIndex === -1) {
        setMessage({ type: 'error', text: 'Gagal menemukan data pengguna Anda. Silakan login ulang.' });
        return;
    }

    // Create a new object for the user to be updated
    const updatedUser = {
        ...allUsers[userIndex],
        name: name,
        profileImage: profileImage
    };

    // Jika user adalah agent, tetap jaga nilai unit
    if (allUsers[userIndex].role === 'agent') {
        updatedUser.unit = allUsers[userIndex].unit;
    }

    if (password) {
      updatedUser.password = password; // In a real app, this should be hashed!
    }

    // Update the user in the main user list
    allUsers[userIndex] = updatedUser;
    localStorage.setItem('users', JSON.stringify(allUsers));

    // Update the currently logged-in user session to reflect changes immediately
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);

    setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
    setPassword('');
    setConfirmPassword('');

    // This event tells the header to update the user's name
    window.dispatchEvent(new Event("storage"));
    // --- End of Robust Update Logic ---
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setMessage({ type: 'error', text: 'Silakan pilih file gambar (JPEG, PNG, JPG, GIF).' });
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Ukuran file terlalu besar. Maksimal 2MB.' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Profil Saya</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-2xl mx-auto shadow-lg">
        <form onSubmit={handleUpdate}>
          {message.text && (
            <p className={`${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} text-sm rounded-lg p-3 text-center mb-6`}>
              {message.text}
            </p>
          )}

          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              {profileImage && profileImage !== '/src/assets/default-avatar.svg' && profileImage !== '/src/assets/default-avatar.png' && !profileImage.startsWith('data:image') ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-gray-300 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-gray-300 flex items-center justify-center bg-blue-600 text-white font-bold text-xl">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                type="button"
                onClick={triggerFileSelect}
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
            <p className="text-gray-600 text-sm mt-2">Klik ikon untuk mengganti foto profil</p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nama Lengkap
            </label>
            <input
              className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 cursor-not-allowed"
              id="email"
              type="email"
              value={currentUser.email}
              readOnly
            />
          </div>

          {/* Unit Field - only for agents */}
          {currentUser.role === 'agent' && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="unit">
                Unit
              </label>
              <input
                className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 cursor-not-allowed"
                id="unit"
                type="text"
                value={currentUser.unit || 'Belum Ditentukan'}
                readOnly
              />
            </div>
          )}

          <hr className="border-gray-300 my-8" />

          <h2 className="text-xl font-semibold mb-4 text-gray-800">Ubah Password</h2>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password Baru
            </label>
            <input
              className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              id="password"
              type="password"
              placeholder="Kosongkan jika tidak ingin diubah"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Konfirmasi Password Baru
            </label>
            <input
              className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              id="confirmPassword"
              type="password"
              placeholder="Konfirmasi password baru Anda"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
              type="submit">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
