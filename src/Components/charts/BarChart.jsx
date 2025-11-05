
import React from 'react';

const BarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center" style={{color: 'black'}}>Tidak ada data untuk grafik</div>;
  }

  const maxValue = Math.max(...data.map(item => item.value), 1); // Avoid division by zero

  // Gunakan warna dari palette Anda
  const colors = {
    Terbuka: '#0F50A1', // Biru tua dari palette
    Dikerjakan: '#F6E603', // Kuning dari palette
    Selesai: '#6FD36A', // Hijau dari palette
  };

  return (
    <div className="w-full h-64 flex p-4 rounded-lg" style={{backgroundColor: 'white', border: '1px solid #e5e7eb'}}>
      {/* Y-axis labels (jumlah tiket) */}
      <div className="flex flex-col justify-between items-end pr-2 py-4" style={{height: 'calc(100% - 2rem)'}}>
        <span className="text-xs" style={{color: '#5A5858'}}>{maxValue}</span>
        <span className="text-xs" style={{color: '#5A5858'}}>{Math.round(maxValue * 0.75)}</span>
        <span className="text-xs" style={{color: '#5A5858'}}>{Math.round(maxValue * 0.5)}</span>
        <span className="text-xs" style={{color: '#5A5858'}}>{Math.round(maxValue * 0.25)}</span>
        <span className="text-xs" style={{color: '#5A5858'}}>0</span>
      </div>
      
      {/* Chart bars */}
      <div className="flex-1 flex items-end justify-around pt-4">
        {data.map(item => (
          <div key={item.label} className="h-full flex flex-col items-center pb-4" style={{width: '30%'}}>
            <div className="flex flex-col items-center justify-end w-full" style={{height: '100%'}}>
              <div 
                className="w-3/4 rounded-t-md transition-all duration-500 shadow-md mx-auto"
                style={{ 
                  height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                  backgroundColor: colors[item.label] || '#5A5858', // Abu-abu dari palette sebagai fallback
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                title={`${item.label}: ${item.value}`}
              ></div>
            </div>
            <span className="text-xs mt-2 font-medium text-center" style={{color: '#5A5858'}}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
