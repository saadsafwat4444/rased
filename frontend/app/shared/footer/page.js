"use client";

export default function Footer() {
  return (
    <footer className="relative w-full bg-gray-900 z-[1000] mt-12 py-6 px-6 text-center text-gray-300 text-sm shadow-inner shadow-black/50">
      <p>© 2026 Rased Platform. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <a href="#" className="hover:text-indigo-400 transition-colors duration-300">Privacy Policy</a>
        <a href="#" className="hover:text-indigo-400 transition-colors duration-300">Terms of Service</a>
        <a href="#" className="hover:text-indigo-400 transition-colors duration-300">Contact Us</a>
      </div>
    </footer>
  );
}