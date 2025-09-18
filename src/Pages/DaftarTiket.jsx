import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../gradient.css"; 

export default function DaftarTiket() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTickets([
      { id: "#1001", judul: "Email Error", status: "Open", tanggal: "10-09-2025" },
      { id: "#1002", judul: "Login Tidak Bisa", status: "Diproses", tanggal: "09-09-2025" },
      { id: "#1003", judul: "Reset Password", status: "Selesai", tanggal: "08-09-2025" },
    ]);
  }, []);

  // Warna status
  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return "bg-[#F6E603] text-[#0F50A1]";
      case "Diproses":
        return "bg-[#49B6B0] text-white";
      case "Selesai":
        return "bg-[#6FD36A] text-[#0E1523]";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 animated-gradient">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-5xl">
        {/* Judul */}
        <h1 className="text-3xl font-bold text-center text-[#0F50A1] mb-6">
          📋 Daftar Tiket
        </h1>

        {/* Tabel */}
        <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow">
          <thead>
            <tr className="bg-[#0F50A1] text-white">
              <th className="p-3">ID Tiket</th>
              <th className="p-3">Judul</th>
              <th className="p-3">Status</th>
              <th className="p-3">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t, i) => (
              <tr
                key={i}
                className="border-b hover:bg-[#9ED9FF]/30 transition"
              >
                <td className="p-3 font-semibold">{t.id}</td>
                <td className="p-3">{t.judul}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                      t.status
                    )}`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="p-3 text-gray-600">{t.tanggal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tombol kembali */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 bg-[#0F50A1] text-white px-6 py-3 rounded-lg hover:bg-[#1577B6] w-full font-semibold shadow-lg transition"
        >
          ⬅️ Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}
