import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../gradient.css"; 

export default function BuatTiket() {
  const [namaPelapor, setNamaPelapor] = useState("");
  const [kategori, setKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggalDibuat] = useState(new Date().toLocaleString());

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Tiket dibuat!\nNama Pelapor: ${namaPelapor}\nKategori: ${kategori}\nDeskripsi: ${deskripsi}\nTanggal Dibuat: ${tanggalDibuat}`
    );
    setNamaPelapor("");
    setKategori("");
    setDeskripsi("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9ED9FF] via-[#49B6B0] to-[#1577B6] flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Judul */}
        <h1 className="text-3xl font-bold text-center text-[#0F50A1] mb-6">
          🎫 Buat Tiket Baru
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700 font-medium">Nama Pelapor</span>
            <input
              type="text"
              value={namaPelapor}
              onChange={(e) => setNamaPelapor(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-[#49B6B0] focus:outline-none"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Kategori</span>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-[#49B6B0] focus:outline-none"
              required
            >
              <option value="">-- Pilih Kategori --</option>
              <option value="Teknis">Teknis</option>
              <option value="Akun">Akun</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Deskripsi</span>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-[#49B6B0] focus:outline-none"
              rows="4"
              required
            ></textarea>
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Tanggal Dibuat</span>
            <input
              type="text"
              value={tanggalDibuat}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 bg-gray-100 text-gray-600"
            />
          </label>

          {/* Tombol */}
          <button
            type="submit"
            className="bg-[#0F50A1] text-white px-4 py-2 rounded-lg hover:bg-[#1577B6] w-full font-semibold shadow"
          >
            🚀 Buat Tiket
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-[#F44336] text-white px-4 py-2 rounded-lg hover:bg-[#E53935] w-full font-semibold shadow"
          >
            ⬅️ Kembali
          </button>
        </form>
      </div>
    </div>
  );
}
