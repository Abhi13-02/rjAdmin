"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen min-w-screen bg-gray-900 flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Dashboard</h1>
        <div className="flex flex-col space-y-4">
          <Link href="/login">
            <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
