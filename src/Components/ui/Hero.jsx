import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero() {
  // kata-kata yang akan berganti animasi
  const words = ["Helpdesk", "Support", "Service"]; 
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center text-white px-4"
      style={{
        backgroundImage: `url('/Ekuitas-Campus.jpg')`, // taruh gambar di folder public/bg-campus.jpg
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay gradient biru agar sesuai warna brand */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F50A1]/90 to-[#1577B6]/90"></div>

      {/* Konten Hero */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative text-center z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Selamat Datang di{" "}
          <span className="text-[#F6E603]">
            <AnimatePresence mode="wait">
              <motion.span
                key={words[index]}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="inline-block"
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          </span>
            <span className="ml-3">Ekuitas</span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Layanan informasi dan bantuan untuk mahasiswa, dosen, dan civitas
          akademika Universitas Ekuitas.
        </p>
        <div className="mt-6">
  <button
    onClick={() => navigate("/buat-tiket")}
    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition"
  >
    Ajukan Pengaduan
  </button>
</div>

      </motion.div>
    </section>
  );
}
