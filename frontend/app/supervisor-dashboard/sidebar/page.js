
// "use client";

// import { useState, useEffect } from "react";
// import { FaPlus, FaList, FaBars, FaTimes, FaHome, FaClipboardList } from "react-icons/fa";

// export default function SupervisorSidebar() {
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
//         <nav className="mt-20 flex flex-col gap-4 px-3">

//             <a
//             href="/supervisor-dashboard"
//             className="flex items-center gap-3 px-6 py-3 hover:bg-indigo-700 transition-colors rounded-lg"
//           >
//             <FaHome className="text-indigo-400" />
//             {isOpen && <span>Home</span>}
//           </a>
//           <a
//             href="/supervisor-dashboard/reports"
//             className="flex items-center gap-3 px-6 py-3 hover:bg-indigo-700 transition-colors rounded-lg"
//           >
//             <FaClipboardList className="text-indigo-400" />
//             {isOpen && <span>Reports</span>}
//           </a>

        
        
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
  FaClipboardList,
} from "react-icons/fa";

export default function SupervisorSidebar() {
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

  const handleLinkClick = () => {
    if (isMobile) setIsOpen(false);
  };

  const menuItems = [
    { href: "/supervisor-dashboard", icon: <FaHome />, label: "Home" },
    { href: "/supervisor-dashboard/reports", icon: <FaClipboardList />, label: "Reports" },
  ];

  return (
    <>
      {/* Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full bg-gray-900 text-white z-40
          transition-all duration-300 ease-in-out
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
          className="absolute -right-3 top-4 bg-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-700 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Menu */}
        <nav className="mt-16 flex flex-col gap-2 px-2">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`
                  flex items-center ${
                    isOpen ? "justify-start px-4" : "justify-center"
                  }
                  py-3 rounded-lg transition-all duration-200
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

                {isOpen && (
                  <span className="ml-3 whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}