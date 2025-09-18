import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-[#F9FAFB]">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-3xl font-bold text-[#0F50A1] mb-8"
        >
          Kontak
        </motion.h2>
        <p className="text-gray-600 mb-6">
          Alamat: Jl. PHH. Mustofa (Suci) No. 31 Bandung 40124 <br />
          Telepon: (022) 7207777 <br />
          Email: info@ekuitas.ac.id
        </p>
        <a
          href="mailto:info@ekuitas.ac.id"
          className="inline-block bg-[#1577B6] text-white px-6 py-3 rounded-lg hover:bg-[#0F50A1] transition"
        >
          Hubungi Kami
        </a>
      </div>
    </section>
  );
}
