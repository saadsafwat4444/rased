 
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaList, FaBars, FaTimes, FaHome, FaUsers, FaClipboardList } from "react-icons/fa";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // less than md is considered mobile
      if (window.innerWidth < 768) setIsOpen(false); // default closed on mobile
      else setIsOpen(true); // open on laptop
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 shadow-2xl z-40 transition-all duration-300
        ${isOpen ? "w-64" : "w-0"} md:${isOpen ? "w-64" : "w-16"}`}
      >
        {/* Toggle Button - Always Visible */}
        <button
          className={`absolute -right-3 top-3 bg-indigo-600 text-white p-2 rounded-full shadow-lg z-50 hover:bg-indigo-700 transition-colors md:flex ${isMobile && !isOpen ? 'flex' : 'hidden'}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (isMobile ? <FaTimes /> : <FaBars className="rotate-180" />) : <FaBars />}
        </button>

        {/* Mobile Toggle Button - Only when sidebar is closed */}
        {isMobile && !isOpen && (
          <button
            className="fixed top-4 left-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-indigo-700 transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <FaBars />
          </button>
        )}

        {/* Menu Items */}

         <a
            href="/admin-dashboard"
            className="flex items-center gap-3 px-6 py-3 hover:bg-indigo-700 transition-colors rounded-lg"
          >
            <FaHome className="text-indigo-400" />
            {isOpen && <span>Home</span>}
          </a>
        <nav className="mt-20 flex flex-col gap-4 px-3">
          <Link
            href="/admin-dashboard/reports"
            className="flex items-center gap-3 px-6 py-3 hover:bg-indigo-700 transition-colors rounded-lg"
          >
            <FaClipboardList className="text-indigo-400" />
            {isOpen && <span>All Reports</span>}
          </Link>

          <Link
            href="/admin-dashboard/users"
            className="flex items-center gap-3 px-6 py-3 hover:bg-indigo-700 transition-colors rounded-lg"
          >
            <FaUsers className="text-indigo-400" />
            {isOpen && <span>Users Management</span>}
          </Link>

          
          <Link
            href="/admin-dashboard/stations"
            className="flex items-center gap-3 px-6 py-3 hover:bg-indigo-700 transition-colors rounded-lg"
          >
            <FaList className="text-indigo-400" />
            {isOpen && <span>Stations</span>}
          </Link>

          
        </nav>
      </aside>
    </>
  );
}