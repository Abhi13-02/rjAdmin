"use client";
import Sidebar from "@/components/SideBar";
import { usePathname } from "next/navigation";

const AdminDashboard = () => {
  const pathname = usePathname(); // Get the current pathname

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">
        {pathname === "/admin/dashboard" && (
          <h1>Welcome to Admin Dashboard</h1>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
