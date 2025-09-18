import React from "react";
import { useNavigate } from "react-router-dom"; 

export default function Navba() {
  const navigate = useNavigate(); 

  return (
    <nav className="w-full bg-gray-800 text-white px-6 py-3 flex items-center shadow-md">
      <h1 className="text-xl font-bold ml-10">Helpdesk System</h1>
      <div className="ml-auto flex items-center gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
          🔔 Notifikasi
        </button>
        <button
          className="bg-red-600 hover:bg-green-700 px-3 py-1 rounded"
          onClick={() => navigate("/")} 
        >
           logout
        </button>
      </div>
    </nav>
  );
}