import React, { useState } from "react";
import { Link } from "react-router-dom";


export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 shadow-lg z-40 transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >

      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 text-white text-2xl"
      >
        ✖
      </button>

      <h2 className="text-2xl font-bold mb-6">Helpdesk</h2>
      <nav className="flex flex-col gap-3">
        <Link to="/Pages/Dashboard" className="hover:bg-gray-700 p-2 rounded">📊 Dashboard</Link>
        <Link to="/Pages/buattiket" className="hover:bg-gray-700 p-2 rounded">➕ Buat Tiket</Link>
        <Link to="/Pages/daftartiket" className="hover:bg-gray-700 p-2 rounded">📂 Daftar Tiket</Link>
 
      </nav>
    </aside>
  );
}
