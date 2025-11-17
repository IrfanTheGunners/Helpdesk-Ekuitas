import React, { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    try {
      const storedCategories = JSON.parse(localStorage.getItem('categories')) || [
        'Teknis',
        'Tagihan', 
        'Umum'
      ];
      setCategories(storedCategories);
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat kategori');
      setLoading(false);
    }
  };

  const addCategory = () => {
    if (!newCategory.trim()) {
      setError('Nama kategori tidak boleh kosong');
      return;
    }

    if (categories.includes(newCategory.trim())) {
      setError('Kategori sudah ada');
      return;
    }

    const updatedCategories = [...categories, newCategory.trim()];
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    setNewCategory('');
    setError('');
  };

  const removeCategory = (categoryToRemove) => {
    const updatedCategories = categories.filter(cat => cat !== categoryToRemove);
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addCategory();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Memuat kategori...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Manajemen Kategori Tiket</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Masukkan nama kategori baru"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={18} />
            Tambah
          </button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">Nama Kategori</th>
              <th className="py-3 px-4 text-right text-gray-600 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="2" className="py-8 px-4 text-center text-gray-500">
                  Belum ada kategori. Tambahkan kategori baru untuk mulai.
                </td>
              </tr>
            ) : (
              categories.map((category, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">{category}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => removeCategory(category)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
                      title="Hapus kategori"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2">Catatan Penting:</h3>
        <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
          <li>Kategori yang dihapus tidak akan menghilangkan tiket yang sudah dibuat dengan kategori tersebut</li>
          <li>Kategori baru akan langsung tersedia di form pembuatan tiket</li>
          <li>Kategori default (Teknis, Tagihan, Umum) akan tetap tersedia</li>
        </ul>
      </div>
    </div>
  );
};

export default CategoryManagement;