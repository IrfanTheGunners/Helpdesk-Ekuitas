import React from 'react';

const PieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center" style={{color: 'black'}}>Tidak ada data untuk grafik</div>;
  }

  // Filter data dengan nilai 0
  const validData = data.filter(item => item.value > 0);
  
  if (validData.length === 0) {
    return <div className="text-center" style={{color: 'black'}}>Tidak ada data untuk grafik</div>;
  }

  // Total keseluruhan nilai
  const total = validData.reduce((sum, item) => sum + item.value, 0);
  
  // Sudut awal
  let currentAngle = 0;
  
  // Warna untuk kategori
  const colors = [
    '#49B6B0', // Teal
    '#1577B6', // Biru
    '#6FD36A', // Hijau
    '#0F50A1', // Biru Tua
    '#F6E603', // Kuning
    '#FF6384', // Merah Muda
    '#36A2EB', // Biru Cerah
    '#FFCE56', // Oranye
    '#4BC0C0', // Teal Cerah
    '#9966FF', // Ungu
    '#FF9F40', // Jingga
    '#FFCD56', // Kuning Emas
  ];

  // Fungsi untuk menghitung koordinat titik pada lingkaran
  const getCoordinates = (angle, radius, centerX, centerY) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian)
    };
  };

  return (
    <div className="w-full h-64 flex items-center justify-center p-4" style={{backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem'}}>
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {validData.map((item, index) => {
            const sliceAngle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + sliceAngle;
            
            const start = getCoordinates(startAngle, 80, 100, 100);
            const end = getCoordinates(endAngle, 80, 100, 100);
            
            // Untuk sudut lebih dari 180 derajat
            const largeArcFlag = sliceAngle > 180 ? 1 : 0;
            
            const pathData = [
              `M 100,100`, // Titik tengah
              `L ${start.x},${start.y}`, // Garis ke titik awal busur
              `A 80,80 0 ${largeArcFlag},1 ${end.x},${end.y}`, // Busur
              `Z` // Kembali ke titik tengah
            ].join(' ');
            
            const color = colors[index % colors.length];
            
            currentAngle = endAngle;
            
            return (
              <g key={index}>
                <path
                  d={pathData}
                  fill={color}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  title={`${item.label}: ${item.value} (${((item.value / total) * 100).toFixed(1)}%)`}
                />
                {/* Label untuk nilai dan persentase */}
                {sliceAngle > 20 && ( // Hanya tampilkan label jika slice cukup besar
                  <text
                    x={getCoordinates((startAngle + endAngle) / 2, 40, 100, 100).x}
                    y={getCoordinates((startAngle + endAngle) / 2, 40, 100, 100).y}
                    fill="#FFFFFF"
                    fontSize="10"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {((item.value / total) * 100).toFixed(1)}%
                  </text>
                )}
              </g>
            );
          })}
          {/* Lingkaran tengah putih */}
          <circle cx="100" cy="100" r="30" fill="white" />
        </svg>
      </div>
      
      {/* Legenda */}
      <div className="ml-6 flex flex-col justify-center">
        {validData.map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <div 
              className="w-4 h-4 rounded mr-2" 
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span className="text-sm" style={{color: '#5A5858'}}>
              {item.label}: {item.value} ({((item.value / total) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;