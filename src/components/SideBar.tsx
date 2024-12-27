"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname(); // Get the current pathname

  const links = [
    { href: "/admin/dashboard/users", label: "Users" },
    { href: "/admin/dashboard/products", label: "Products" },
    { href: "/admin/dashboard/orders", label: "Orders" },
  ];

  const normalizePath = (path: string) => path.replace(/\/$/, ""); // Remove trailing slash

  const handleLogout = () => {
    fetch("/api/auth/logout", { method: "POST" })
      .then(() => {
        window.location.href = "/login"; // Redirect to login page after logout
      })
      .catch((error) => console.error("Logout failed:", error));
  };

  return (
    <aside key={pathname} className="w-64 h-screen bg-gray-800 text-white shadow-lg p-6">
      <div className="flex flex-col h-full">
        {/* Sidebar Links */}
        <ul className="space-y-6 flex-grow">
          {links.map(({ href, label }) => (
            <li
              key={href}
              className={`p-3 rounded-md transition-all duration-200 ${
                normalizePath(pathname) === normalizePath(href) ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <Link href={href} prefetch={false} className="block text-lg">
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <button
          className="bg-red-600 hover:bg-red-500 text-white mt-6 p-3 rounded-md w-full"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
