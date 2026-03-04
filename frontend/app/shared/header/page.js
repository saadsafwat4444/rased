"use client";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut(auth);   
      await fetch("/api/logout", { method: "POST" });
        
      router.push("/auth/login");    
    } catch (err) {
      console.error("Logout Error:", err);
      alert("An error occurred during logout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="w-full bg-gray-900 text-gray-100 z-[1000] flex justify-between items-center p-4 shadow-lg shadow-black/50 relative">
      {/* Logo */}
      <div className="text-indigo-400 text-2xl font-bold">
        Rased
      </div>

      {/* Desktop Navigation */}
      <nav className="space-x-8 hidden md:flex text-gray-100 font-medium">
        <a href="/shared/about" className="hover:text-indigo-300 transition-colors duration-300">About</a>
        <button
          onClick={handleLogout}
          disabled={loading}
          className={`px-4 py-2 rounded ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
          } text-white transition`}
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </nav>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-100 hover:text-indigo-300 text-2xl transition"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-800 border-t border-gray-700 md:hidden">
          <nav className="flex flex-col p-4 space-y-4">
            <a 
              href="/shared/about" 
              className="text-gray-100 hover:text-indigo-300 transition-colors duration-300 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <button
              onClick={handleLogout}
              disabled={loading}
              className={`px-4 py-2 rounded w-full ${
                loading ? "bg-gray-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
              } text-white transition`}
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}