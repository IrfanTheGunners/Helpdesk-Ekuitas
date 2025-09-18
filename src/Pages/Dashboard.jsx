import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import "../gradient.css"; 

export default function Dashboard() {
  const [summary, setSummary] = useState({ open: 0, progress: 0, done: 0 });
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSummary({ open: 500, progress: 3, done: 100 });
    setTickets([
      { id: "#1001", judul: "Email Error", status: "Open", tanggal: "10-09-2025" },
      { id: "#1002", judul: "Login Tidak Bisa", status: "Diproses", tanggal: "09-09-2025" },
      { id: "#1003", judul: "Reset Password", status: "Selesai", tanggal: "08-09-2025" },
    ]);
  }, []);

  const filteredTickets = tickets.filter((t) =>
    t.judul.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen animated-gradient flex">
      <Sidebar />
      <main className="flex-1 p-6">
        {/* Judul */}
        <h1 className="text-2xl font-bold text-[#0F50A1] mb-6">
          📊 Dashboard Helpdesk
        </h1>

        {/* Ringkasan Tiket */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#9ED9FF] p-6 rounded-xl shadow hover:scale-105 transition">
            <h3 className="text-lg font-medium text-[#5A5858]">Tiket Open</h3>
            <div className="text-3xl font-bold text-[#0F50A1]">{summary.open}</div>
          </div>
          <div className="bg-[#49B6B0] p-6 rounded-xl shadow hover:scale-105 transition">
            <h3 className="text-lg font-medium text-white">Tiket Diproses</h3>
            <div className="text-3xl font-bold text-white">{summary.progress}</div>
          </div>
          <div className="bg-[#6FD36A] p-6 rounded-xl shadow hover:scale-105 transition">
            <h3 className="text-lg font-medium text-white">Tiket Selesai</h3>
            <div className="text-3xl font-bold text-white">{summary.done}</div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col items-center mb-6">
          <h3 className="text-xl font-semibold text-[#0F50A1] mb-3">📌 Tiket Terbaru</h3>
          <input
            type="text"
            placeholder="Cari tiket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1577B6] w-64 text-center"
          />
        </div>

        {/* Table Tiket */}
        <div className="bg-white p-6 rounded-xl shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F50A1] text-white">
                <th className="p-3 rounded-l-lg">ID Tiket</th>
                <th className="p-3">Judul</th>
                <th className="p-3">Status</th>
                <th className="p-3 rounded-r-lg">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((t, i) => (
                  <tr
                    key={i}
                    className="border-b hover:bg-[#F6E603]/20 transition"
                  >
                    <td className="p-3 font-medium text-[#1577B6]">{t.id}</td>
                    <td className="p-3 text-[#5A5858]">{t.judul}</td>
                    <td
                      className={`p-3 font-semibold ${
                        t.status === "Open"
                          ? "text-[#0F50A1]"
                          : t.status === "Diproses"
                          ? "text-[#49B6B0]"
                          : "text-[#6FD36A]"
                      }`}
                    >
                      {t.status}
                    </td>
                    <td className="p-3 text-gray-500">{t.tanggal}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    Tidak ada tiket ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
