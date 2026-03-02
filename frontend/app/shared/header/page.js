

"use client";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // لو null → المستخدم مش عامل login
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
      alert("حدث خطأ أثناء تسجيل الخروج");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="w-full bg-gray-900 text-gray-100 z-[1000] flex justify-between items-center p-4 shadow-lg shadow-black/50">
      {/* Logo */}
      <div className="text-indigo-400 text-2xl font-bold">
        Rased
      </div>

      {/* Navigation */}
      <nav className="space-x-8 hidden md:flex text-gray-100 font-medium">
        {/* <a href="/" className="hover:text-indigo-300 transition-colors duration-300">Home</a> */}
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
        <button className="text-gray-100 hover:text-indigo-300 text-2xl transition">
          ☰
        </button>
      </div>
    </header>
  );
}