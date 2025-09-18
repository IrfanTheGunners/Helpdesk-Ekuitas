import { motion } from "framer-motion";

export default function Programs() {
  const programs = [
    "Fakultas Ekonomi dan Bisnis",
    "Fakultas Teknik dan Informatika",
    "Fakultas Ilmu Sosial dan Humaniora",
  ];

  return (
    <section id="programs" className="py-20 bg-[#F9FAFB]">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-3xl font-bold text-[#0F50A1] mb-12"
        >
          Program Studi
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((prog, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: false }}
              className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-[#1577B6]">{prog}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
