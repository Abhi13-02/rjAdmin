"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
  const pathname = usePathname(); // Get the current pathname
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const links = [
    { href: "/admin/dashboard/users", label: "Users" },
    { href: "/admin/dashboard/products", label: "Products" },
    { href: "/admin/dashboard/orders", label: "Orders" },
  ];

  const handleLogout = () => {
    fetch("/api/auth/logout", { method: "POST" }) // Replace with your API route
      .then(() => {
        window.location.href = "/login"; // Redirect to login page after logout
      })
      .catch((error) => console.error("Logout failed:", error));
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-800 text-white p-3 rounded-md shadow-lg"
      >
        {isSidebarOpen ? (
          <span>Close Menu</span>
        ) : (
          <span>Open Menu</span>
        )}
      </button>

      {/* Collapsible Sidebar */}
      <aside
        className={`fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 z-40 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex flex-col items-center">
          {/* Sidebar Links */}
          <ul className="space-y-4 w-full">
            {links.map(({ href, label }) => (
              <li
                key={href}
                className={`p-3 rounded-md text-center transition-all duration-200 ${
                  pathname === href ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
              >
                <Link href={href} className="block text-lg">
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <button
            className="bg-red-600 hover:bg-red-500 text-white mt-4 p-3 rounded-md w-full"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
