import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Dashboard from "./Pages/Dashboard";
import BuatTiket from "./Pages/BuatTiket";
import DaftarTiket from "./Pages/DaftarTiket";
import Login from "./Pages/Login";
import Faq from "./Pages/Faq";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import LandingPage from "./Pages/LandingPage";

function AppLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();


  const hideLayoutOn = ["/", "/Pages/login"]
 
  const isLanding = hideLayoutOn.includes(location.pathname);

  return (
    <>
      {!isLanding && (
        <>
          {!isOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="fixed top-3 left-5 z-50 p-2 bg-gray-800 text-white rounded-md focus:outline-none"
            >
              <FaBars size={20} />
            </button>
          )}
          <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(false)} />
        </>
      )}

      <main className={`transition-all duration-300 ${!isLanding && isOpen ? "ml-64" : "ml-0"}`}>
        {!isLanding && <Navbar />}

        <div className="p-0 mt-0">
        
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/Pages/Dashboard" element={<Dashboard />} />
            <Route path="/Pages/buattiket" element={<BuatTiket />} />
            <Route path="/Pages/daftartiket" element={<DaftarTiket />} />
            <Route path="/Pages/login" element={<Login />} />
            <Route path="/Pages/Faq" element={<Faq />} />
          </Routes>
        </div>
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
