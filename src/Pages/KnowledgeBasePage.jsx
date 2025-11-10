
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import kbData from '../data/kb.json';
import { Search, Filter } from 'lucide-react';

const KnowledgeBasePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredArticles, setFilteredArticles] = useState(kbData);

  // Use the same categories as in the ticket creation form
  const ticketCategories = ['Teknis', 'Tagihan', 'Umum'];
  
  // Get all unique categories from kbData
  const allKbCategories = [...new Set(kbData.map(article => article.category))];
  
  // Combine ticket categories with any additional categories in kbData
  // Prioritize ticket categories in the dropdown
  const uniqueCategories = [...new Set([...ticketCategories, ...allKbCategories])];
  
  // Create the final categories list with 'all' first
  const categories = ['all', ...uniqueCategories];

  useEffect(() => {
    let results = kbData;
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      results = results.filter(article => article.category === selectedCategory);
    }
    
    setFilteredArticles(results);
  }, [searchTerm, selectedCategory]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center" style={{color: 'black'}}>Pusat Bantuan</h1>
        <p className="text-center mb-8" style={{color: 'black'}}>Temukan jawaban atas pertanyaan Anda di sini.</p>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2" style={{color: 'black'}} size={24} />
              <input 
                type="text"
                placeholder="Ketik untuk mencari artikel..."
                className="w-full rounded-full py-4 pl-14 pr-6 text-lg focus:outline-none shadow-sm focus:shadow-md transition-shadow duration-300"
                style={{
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid #e5e7eb'
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{color: 'black'}}>
                <Filter size={20} />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-64 rounded-full py-4 pl-12 pr-6 text-lg focus:outline-none shadow-sm focus:shadow-md transition-shadow duration-300 appearance-none"
                style={{
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid #e5e7eb'
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Semua Kategori' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Results Count and Popular Tags */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-gray-700">
                Ditemukan <span className="font-bold" style={{color: '#0F50A1'}}>{filteredArticles.length}</span> artikel
                {selectedCategory !== 'all' && (
                  <span> dalam kategori "<span className="font-bold">{selectedCategory}</span>"</span>
                )}
                {searchTerm && (
                  <span> yang cocok dengan "<span className="font-bold">{searchTerm}</span>"</span>
                )}
              </p>
            </div>
            
            {/* Popular Categories Quick Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-600 font-medium mr-2">Kategori cepat:</span>
              {ticketCategories.slice(0, 3).map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles */}
        <div className="space-y-4">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <details key={article.id} className="rounded-lg p-5 cursor-pointer group shadow-md hover:shadow-lg transition-shadow duration-300 bg-white" style={{
                color: 'black'
              }}>
                <summary className="flex justify-between items-center font-semibold text-lg list-none" style={{color: 'black'}}>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-sm font-medium" style={{
                      backgroundColor: '#f0f9ff',
                      color: '#0c4a6e',
                      border: '1px solid #bae6fd'
                    }}>
                      {article.category}
                    </span>
                    {article.title}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {new Date(article.createdAt).toLocaleDateString('id-ID')}
                    </span>
                    <span style={{color: 'black'}} className="transform transition-transform duration-300 group-open:rotate-90">▶</span>
                  </div>
                </summary>
                <p className="mt-4" style={{color: 'black'}}>
                  {article.content}
                </p>
              </details>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <p className="text-lg" style={{color: 'black'}}>Tidak ada artikel yang cocok dengan pencarian Anda.</p>
              <p className="text-gray-500 mt-2">Coba gunakan kata kunci yang berbeda atau pilih kategori lain</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KnowledgeBasePage;
