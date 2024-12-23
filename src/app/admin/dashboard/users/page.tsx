"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  userId: string;
  name: string;
  address: string;
  orderCount: number;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users/getAllUsers");
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Users</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Address</th>
                <th className="px-6 py-3 text-left">Orders</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.userId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <td className="px-6 py-4 border-t text-gray-900 dark:text-gray-100">{user.name}</td>
                  <td className="px-6 py-4 border-t text-gray-900 dark:text-gray-100">{user.address}</td>
                  <td className="px-6 py-4 border-t text-gray-900 dark:text-gray-100">{user.orderCount}</td>
                  <td className="px-6 py-4 border-t text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500">
                    <Link href={`/admin/dashboard/users/${user.userId}`}>
                      View Orders
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center text-gray-500 dark:text-gray-400 px-6 py-4 border-t"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
