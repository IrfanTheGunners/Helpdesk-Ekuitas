
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import kbData from '../data/kb.json';
import { Search } from 'lucide-react';

const KnowledgeBasePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState(kbData);

  useEffect(() => {
    const results = kbData.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(results);
  }, [searchTerm]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center" style={{color: 'black'}}>Pusat Bantuan</h1>
        <p className="text-center mb-8" style={{color: 'black'}}>Temukan jawaban atas pertanyaan Anda di sini.</p>

        {/* Search Bar */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2" style={{color: 'black'}} size={24} />
          <input 
            type="text"
            placeholder="Ketik untuk mencari artikel..."
            className="w-full rounded-full py-4 pl-14 pr-6 text-lg focus:outline-none"
            style={{
              backgroundColor: 'white',
              borderColor: '#1577B6',
              color: 'black',
              borderWidth: '2px'
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Articles */}
        <div className="space-y-4">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <details key={article.id} className="border rounded-lg p-5 cursor-pointer group" style={{
                backgroundColor: 'white',
                borderColor: '#1577B6',
                color: 'black'
              }}>
                <summary className="flex justify-between items-center font-semibold text-lg list-none" style={{color: 'black'}}>
                  {article.title}
                  <span style={{color: 'black'}} className="transform transition-transform duration-300 group-open:rotate-90">▶</span>
                </summary>
                <p className="mt-4" style={{color: 'black'}}>
                  {article.content}
                </p>
              </details>
            ))
          ) : (
            <p className="text-center py-8" style={{color: 'black'}}>Tidak ada artikel yang cocok dengan pencarian Anda.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KnowledgeBasePage;
