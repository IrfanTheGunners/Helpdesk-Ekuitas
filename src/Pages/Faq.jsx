import React from "react";
import { useNavigate } from "react-router-dom";

export default function Faq() {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "Bagaimana cara membuat tiket baru?",
     
    },
    {
      question: "Bagaimana cara mengecek status tiket saya?",
     
    },
    {
      question: "Apa saja kategori tiket yang tersedia?",
     
    },
    {
      question: "Berapa lama tiket biasanya diproses?",
      
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          FAQ (Pertanyaan yang Sering Diajukan)
        </h2>

        <div className="space-y-4 mb-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b pb-3">
              <h3 className="font-semibold text-gray-700">{faq.question}</h3>
              <p className="text-gray-600 mt-1">{faq.answer}</p>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}
