"use client";
import Sidebar from "@/components/SideBar";
import { usePathname } from "next/navigation";

const AdminDashboard = () => {
  const pathname = usePathname(); // Get the current pathname

  return (
    <div className="dashboard">
      <div className="content">
        <h1>Welcome dear admin</h1>
      </div>
    </div>
  );
};

export default AdminDashboard;
