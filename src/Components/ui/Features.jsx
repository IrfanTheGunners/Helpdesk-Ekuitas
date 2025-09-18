import { motion } from "framer-motion";

export default function Features() {
  const features = [
    {
      title: "Pelayanan Cepat",
      desc: "Respon cepat untuk setiap pertanyaan dan keluhan.",
    },
    {
      title: "Terintegrasi",
      desc: "Sistem terhubung dengan layanan kampus lain.",
    },
    {
      title: "24/7 Akses",
      desc: "Bisa diakses kapanpun melalui platform online.",
    },
  ];

  return (
    <section  id="features" className="py-20 bg-[#F9FAFB]">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-3xl font-bold text-[#0F50A1] mb-12"
        >
          Fitur Utama
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: false }}
              className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-[#1577B6] mb-2">
                {f.title}
              </h3>
              <p className="text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
