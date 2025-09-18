export default function Footer() {
  return (
    <footer className="bg-[#0F50A1] text-white py-6 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Universitas Ekuitas. All rights reserved.</p>
        <div className="space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:underline">Kebijakan Privasi</a>
          <a href="#" className="hover:underline">Syarat & Ketentuan</a>
        </div>
      </div>
    </footer>
  );
}
