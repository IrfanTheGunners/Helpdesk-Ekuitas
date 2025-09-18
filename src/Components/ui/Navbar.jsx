import { useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Beranda", href: "#hero" },
    { name: "Fitur", href: "#features" },
    { name: "Tentang", href: "#about" },
    { name: "Program", href: "#programs" },
    { name: "FAQ", href: "#faq" },
    { name: "Kontak", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo + Teks */}
        <div className="flex items-center gap-2">
          <img
            src="/src/assets/ekuitas-logo.png"
            alt="Logo Ekuitas"
            className="h-10 w-10"
          />
          <span className="text-[#0F50A1] font-bold text-lg">Ekuitas</span>
        </div>

        {/* Menu Desktop */}
        <ul className="hidden md:flex items-center gap-6">
          {menuItems.map((item, i) => (
            <li key={i}>
              <a
                href={item.href}
                className="text-gray-700 hover:text-[#0F50A1] transition"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Tombol Login */}
        <div className="hidden md:block">
          <a
            href="/login"
            className="bg-[#1577B6] text-white px-4 py-2 rounded-lg hover:bg-[#0F50A1] transition"
          >
            Login
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white shadow-md px-4 py-2 space-y-2"
        >
          {menuItems.map((item, i) => (
            <li key={i}>
              <a
                href={item.href}
                className="block py-2 text-gray-700 hover:text-[#0F50A1]"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/login"
              className="block py-2 bg-[#1577B6] text-white rounded-lg text-center hover:bg-[#0F50A1] transition"
              onClick={() => setIsOpen(false)}
            >
              Login
            </a>
          </li>
        </motion.ul>
      )}
    </nav>
  );
}
