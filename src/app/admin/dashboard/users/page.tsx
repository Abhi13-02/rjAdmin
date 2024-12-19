"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/SideBar";

// Define types for User
interface User {
  userId: string;
  name: string;
  address: string;
  orderCount: number;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users/getAllUsers");
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Users</h1>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Address</th>
                <th className="px-6 py-3 text-left">Orders</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.userId}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-6 py-4 border-t">{user.name}</td>
                  <td className="px-6 py-4 border-t">{user.address}</td>
                  <td className="px-6 py-4 border-t">{user.orderCount}</td>
                  <td className="px-6 py-4 border-t text-blue-500 hover:text-blue-700">
                    <Link href={`/admin/dashboard/users/${user.userId}`}>
                      View Orders
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
