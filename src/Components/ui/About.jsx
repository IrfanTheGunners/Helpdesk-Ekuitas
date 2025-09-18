import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
        >
          <h2 className="text-3xl font-bold text-[#0F50A1] mb-4">
            Tentang Universitas Ekuitas
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Universitas Ekuitas adalah perguruan tinggi di Bandung yang
            berkomitmen mencetak lulusan unggul di bidang ekonomi, bisnis,
            teknologi, dan bidang lainnya. Dengan dukungan tenaga pengajar
            profesional dan fasilitas modern, Ekuitas menjadi pilihan tepat
            untuk masa depan.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
        >
          <img
            src="/src/assets/ekuitas-gedung.png" 
            alt="Gedung Ekuitas"
            className="rounded-lg shadow"
          />
        </motion.div>
      </div>
    </section>
  );
}
