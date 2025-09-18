import { useState } from "react";
import { motion } from "framer-motion";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: "Apa itu Helpdesk Ekuitas?", a: "Layanan bantuan online untuk civitas akademika Ekuitas." },
    { q: "Bagaimana cara login?", a: "Gunakan username dan password SIAKAD Anda." },
    { q: "Apakah layanan tersedia 24 jam?", a: "Ya, sistem bisa diakses kapanpun." },
  ];

  return (
    <section  id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-3xl font-bold text-[#0F50A1] text-center mb-12"
        >
          FAQ
        </motion.h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((item, i) => (
            <div key={i} className="border rounded-lg">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center px-4 py-3 text-left"
              >
                <span className="font-medium text-[#1577B6]">{item.q}</span>
                <span>{openIndex === i ? "-" : "+"}</span>
              </button>
              {openIndex === i && (
                <div className="px-4 pb-3 text-gray-600">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
