 
// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { FaPlus, FaList, FaBars, FaTimes, FaHome, FaUsers, FaClipboardList } from "react-icons/fa";

// export default function AdminSidebar() {
//   const [isOpen, setIsOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768); // less than md is considered mobile
//       if (window.innerWidth < 768) setIsOpen(false); // default closed on mobile
//       else setIsOpen(true); // open on laptop
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <>
//       {/* Overlay for mobile */}
//       {isMobile && isOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-30"
//           onClick={() => setIsOpen(false)}
//         ></div>
//       )}

//       <aside
//         className={`fixed top-0 left-0 h-full bg-gray-900 shadow-2xl z-40 transition-all duration-300
//         ${isOpen ? "w-64" : "w-0"} md:${isOpen ? "w-64" : "w-16"}`}
//       >
//         {/* Toggle Button - Always Visible */}
//         <button
//           className={`absolute -right-3 top-3 bg-indigo-600 text-white p-2 rounded-full shadow-lg z-50 hover:bg-indigo-700 transition-colors md:flex ${isMobile && !isOpen ? 'flex' : 'hidden'}`}
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           {isOpen ? (isMobile ? <FaTimes /> : <FaBars className="rotate-180" />) : <FaBars />}
//         </button>

//         {/* Mobile Toggle Button - Only when sidebar is closed */}
//         {isMobile && !isOpen && (
//           <button
//             className="fixed top-4 left-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-indigo-700 transition-colors"
//             onClick={() => setIsOpen(true)}
//           >
//             <FaBars />
//           </button>
//         )}

//         {/* Menu Items */}

//          <a
//             href="/admin-dashboard"
//             className="flex items-center gap-3 px-6 py-3 hover:bg-indigo-700 transition-colors rounded-lg"
//           >
//             <FaHome className="text-indigo-400" />
//             {isOpen && <span>Home</span>}
//           </a>
//         <nav className="mt-20 flex flex-col gap-4 px-3">
//           <Link
//             href="/admin-dashboard/reports"
//             className="flex items-center gap-3 px-6 py-3 hover:bg-indigo-700 transition-colors rounded-lg"
//           >
//             <FaClipboardList className="text-indigo-400" />
//             {isOpen && <span>All Reports</span>}
//           </Link>

//           <Link
//             href="/admin-dashboard/users"
//             className="flex items-center gap-3 px-6 py-3 hover:bg-indigo-700 transition-colors rounded-lg"
//           >
//             <FaUsers className="text-indigo-400" />
//             {isOpen && <span>Users Management</span>}
//           </Link>

          
//           <Link
//             href="/admin-dashboard/stations"
//             className="flex items-center gap-3 px-6 py-3 hover:bg-indigo-700 transition-colors rounded-lg"
//           >
//             <FaList className="text-indigo-400" />
//             {isOpen && <span>Stations</span>}
//           </Link>

          
//         </nav>
//       </aside>
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
  FaClipboardList,
  FaList,
} from "react-icons/fa";

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { href: "/admin-dashboard", icon: <FaHome />, label: "Home" },
    { href: "/admin-dashboard/reports", icon: <FaClipboardList />, label: "Reports" },
    { href: "/admin-dashboard/users", icon: <FaUsers />, label: "Users" },
    { href: "/admin-dashboard/stations", icon: <FaList />, label: "Stations" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Overlay - Mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-gray-900 text-white z-40
          transition-all duration-300
          ${isMobile
            ? isOpen
              ? "translate-x-0 w-64"
              : "-translate-x-full w-64"
            : isOpen
            ? "w-64"
            : "w-20"}
        `}
      >
        {/* Toggle Button */}
        <button
          className="absolute -right-3 top-4 bg-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className="mt-16 flex flex-col gap-2 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    isActive
                      ? "bg-indigo-600"
                      : "hover:bg-indigo-700"
                  }
                `}
              >
                <span className="text-indigo-300 text-lg">
                  {item.icon}
                </span>
                {isOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`
          flex-1 transition-all duration-300
          ${isMobile ? "ml-0" : isOpen ? "ml-64" : "ml-20"}
        `}
      >
        {/* Top Navbar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>

          {isMobile && (
            <button
              className="bg-indigo-600 text-white p-2 rounded-md"
              onClick={() => setIsOpen(true)}
            >
              <FaBars />
            </button>
          )}
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}