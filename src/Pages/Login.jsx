import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../gradient.css"; 

export default function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "12345") {
      alert("Login berhasil!");
      setIsLoggedIn(true); 
      navigate("/Pages/Dashboard");
    } else {
      alert("Username atau password salah!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-gradient px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        {/* Judul */}
        <h1 className="text-3xl font-bold text-center mb-6 text-[#0F50A1]">
          🔐 Login Helpdesk
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#5A5858] mb-1 font-medium">
              Username / Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#49B6B0] transition"
              placeholder="Masukkan username atau email"
              required
            />
          </div>
          <div>
            <label className="block text-[#5A5858] mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1577B6] transition"
              placeholder="Masukkan password"
              required
            />
          </div>

          {/* Tombol Login */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white shadow-md transition bg-gradient-to-r from-[#0F50A1] to-[#1577B6] hover:from-[#1577B6] hover:to-[#49B6B0]"
          >
            Login
          </motion.button>
        </form>

        {/* Footer kecil */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} Helpdesk System. All Rights Reserved.
        </p>
      </motion.div>
    </div>
  );
}
