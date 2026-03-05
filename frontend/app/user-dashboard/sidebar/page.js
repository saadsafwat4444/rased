
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaPlus,
  FaList,
  FaBars,
  FaTimes,
  FaHome,
} from "react-icons/fa";

export default function UserSidebar() {
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
    { href: "/user-dashboard", icon: <FaHome />, label: "Home" },
    { href: "/user-dashboard/new-report", icon: <FaPlus />, label: "New Report" },
    { href: "/user-dashboard/my-report", icon: <FaList />, label: "My Reports" },
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