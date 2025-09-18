import React from "react";
import { motion } from "framer-motion";

export default function Mitra() {
  return (
    <section id="mitra" className="py-10 bg-gray-100 text-center">
      {/* Judul animasi */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-3xl font-bold text-[#0F50A1] mb-8"
      >
        Mitra Kami
      </motion.h2>

      {/* Logo animasi */}
      <motion.div
        className="flex justify-center gap-8 flex-wrap"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.img
          src="/Bank-Bjb.png"
          alt="Mitra 1"
          className="h-24"
          whileHover={{ scale: 1.1 }}
        />
        <motion.img
          src="/Kanazawa-Dark.png"
          alt="Mitra 2"
          className="h-24"
          whileHover={{ scale: 1.1 }}
        />
        <motion.img
          src="/UIS-Logo.png"
          alt="Mitra 3"
          className="h-24"
          whileHover={{ scale: 1.1 }}
        />
        <motion.img
          src="/YKP-BJB.png"
          alt="Mitra 4"
          className="h-24"
          whileHover={{ scale: 1.1 }}
        />
      </motion.div>
    </section>
  );
}
