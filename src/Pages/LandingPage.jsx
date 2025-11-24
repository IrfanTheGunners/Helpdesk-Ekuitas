import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is logged in
  const isAuthenticated = localStorage.getItem('user') !== null;
  
  // If user is logged in, redirect to dashboard
  if (isAuthenticated) {
    window.location.href = "/dashboard"; // Redirect to dashboard
    return null; // Return null to prevent rendering
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9ED9FF] to-white">
      {/* Custom Navbar for Landing Page */}
      <nav className="w-full bg-[#0F50A1] text-white px-6 py-3 flex items-center shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex items-center">
          <div className="flex items-center gap-3">
            <img
              src="/ekuitas-new.png"
              alt="Logo Ekuitas"
              className="h-10 w-10 shadow-lg rounded-full"
            />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="h-6 w-px bg-white/50 mx-2 hidden md:block"></div>
            <button
              className="bg-[#F6E603] text-[#0F50A1] hover:bg-yellow-300 px-4 py-2 rounded-lg transition duration-300 font-semibold"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-[#F5F5F0] px-4 pt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-[#0F50A1]">
                Selamat Datang di <span className="text-[#F6E603] font-extrabold">Helpdesk</span> <span className="text-[#0F50A1] font-extrabold">Ekuitas</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-black mb-6 md:mb-8">
                Selamat datang di Helpdesk Ticketing System, tempat untuk melaporkan masalah, mengajukan permintaan, 
                dan memantau status tiket dengan mudah. Layanan tersedia setiap hari, dan tim kami siap membantu 
                di jam kerja pukul 08:00 sampai 17:00 WIB.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="bg-[#F6E603] text-[#0F50A1] hover:bg-yellow-300 px-6 py-3 md:px-8 md:py-3 rounded-lg font-bold transition duration-300 transform hover:scale-105 shadow-lg"
                  onClick={() => navigate('/register')}
                >
                  Daftar Sekarang
                </button>
                <button 
                  className="bg-transparent border-2 border-[#0F50A1] text-[#0F50A1] hover:bg-[#0F50A1]/10 px-6 py-3 md:px-8 md:py-3 rounded-lg font-semibold transition duration-300 shadow-lg"
                  onClick={() => setShowInfoModal(true)}
                >
                  Pelajari Lebih
                </button>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <img 
                src="border-ekuitas.png" 
                alt="Helpdesk" 
                className="max-w-[90%] md:max-w-[120%] h-auto max-h-[500px] object-contain rounded-lg transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md md:max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#0F50A1]">Tentang <span className="text-[#F6E603] font-bold">Helpdesk</span> <span className="text-[#0F50A1]">Ekuitas</span></h3>
                <button 
                  onClick={() => setShowInfoModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  Helpdesk System adalah platform digital yang menyediakan layanan dan bantahan kepada seluruh 
                  civitas akademika <span className="text-[#0F50A1] font-bold">Universitas Ekuitas</span>. Dengan sistem yang responsif dan efisien, kami berkomitmen 
                  untuk memberikan solusi terbaik atas setiap pertanyaan dan masalah yang Anda hadapi.
                </p>
                <h4 className="font-bold text-[#0F50A1]">Layanan Kami:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>IT Support - Penanganan masalah teknologi dan sistem informasi kampus</li>
                  <li>Akademik - Informasi dan bantuan terkait proses akademik</li>
                  <li>Administrasi - Layanan administrasi dan umum lainnya</li>
                </ul>
                <p>
                  Selamat datang di Helpdesk Ticketing System, tempat untuk melaporkan masalah, mengajukan permintaan, 
                  dan memantau status tiket dengan mudah. Layanan tersedia setiap hari, dan tim kami siap membantu 
                  di jam kerja pukul 08:00 sampai 17:00 WIB.
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  className="bg-[#0F50A1] text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition duration-300"
                  onClick={() => setShowInfoModal(false)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
