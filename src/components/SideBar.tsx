"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
  const pathname = usePathname(); // Get the current pathname
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const links = [
    { href: "/admin/dashboard/users", label: "Users" },
    { href: "/admin/dashboard/products", label: "Products" },
    { href: "/admin/dashboard/orders", label: "Orders" },
  ];

  const normalizePath = (path: string) => path.replace(/\/$/, ""); // Remove trailing slash

  const handleLogout = () => {
    fetch("/api/auth/logout", { method: "POST" }) // Replace with your API route
      .then(() => {
        window.location.href = "/login"; // Redirect to login page after logout
      })
      .catch((error) => console.error("Logout failed:", error));
  };

  return (
    <>
      {/* Sidebar for large screens */}
      <aside className="hidden sm:flex sm:flex-col sm:w-64 sm:h-screen sm:bg-gray-800 sm:text-white sm:shadow-lg sm:p-6">
        <ul className="space-y-6 flex-grow">
          {links.map(({ href, label }) => (
            <li
              key={href}
              className={`p-3 rounded-md transition-all duration-200 ${
                pathname === href ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <Link href={href} className="block text-lg">
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className="bg-red-600 hover:bg-red-500 text-white mt-6 p-3 rounded-md w-full"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      {/* Collapsible dropdown for smaller screens */}
      <div className="sm:hidden fixed bottom-0 w-full bg-gray-800 text-white shadow-lg">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full text-center p-4 bg-gray-900"
        >
          {isDropdownOpen ? "Close Menu" : "Open Menu"}
        </button>

        <div
          className={`transition-all duration-300 overflow-hidden ${
            isDropdownOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <ul className="space-y-6 p-4">
            {links.map(({ href, label }) => (
              <li
                key={href}
                className={`p-3 rounded-md transition-all duration-200 ${
                  pathname === href ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
              >
                <Link href={href} className="block text-lg">
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            className="bg-red-600 hover:bg-red-500 text-white mt-6 p-3 rounded-md w-full"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
