"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  images: string[];
}

interface Order {
  _id: string;
  userId: string;
  userName: string; // New field for displaying the user name
  shiprocketOrderId: string; // New field for Shiprocket Order ID
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: any; // Replace with a specific type if available
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'COD' | 'Prepaid';
  createdAt: string;
  updatedAt: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders/all');
        // Sort orders so that the newest orders appear first
        const sortedOrders = response.data.sort(
          (a: Order, b: Order) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
      } catch (error: any) {
        setError(error.response?.data?.error || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const response = await axios.delete(`/api/orders/delete?orderId=${orderId}`);
      if (response.status === 200) {
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
      }
    } catch (error: any) {
      alert("Failed to delete order");
    }
  };

  // Filter orders by shiprocketOrderId (case insensitive)
  const filteredOrders = orders.filter((order) =>
    order.shiprocketOrderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-center dark:text-white">Orders</h1>
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by Shiprocket Order ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 w-full max-w-md rounded"
        />
      </div>
      
      {/* Mobile Card Layout */}
      <div className="space-y-4 block sm:hidden">
        {filteredOrders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 shadow-md bg-white dark:bg-gray-800">
            <p className="font-semibold text-sm">User ID: {order.userId}</p>
            <p className="text-sm">Shiprocket Order ID: {order.shiprocketOrderId}</p>
            <p className="text-sm">Total: ₹{order.totalAmount}</p>
            <p className="text-sm">Status: {order.status}</p>
            <p className="text-sm">Payment: {order.paymentMethod}</p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Created: {new Date(order.createdAt).toLocaleString()}
            </p>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => router.push(`/users/${order.userId}`)}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded text-xs"
              >
                View
              </button>
              <button
                onClick={() => handleDelete(order._id)}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Desktop Table Layout */}
      <div className="hidden sm:block">
        <table className="min-w-full border-collapse border border-gray-300 bg-white dark:bg-gray-800">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">User ID</th>
              <th className="border border-gray-300 px-4 py-2">Shiprocket Order ID</th>
              <th className="border border-gray-300 px-4 py-2">Total Amount</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Payment Method</th>
              <th className="border border-gray-300 px-4 py-2">Created At</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="text-sm">
                <td className="border border-gray-300 px-4 py-2">{order.userId}</td>
                <td className="border border-gray-300 px-4 py-2">{order.shiprocketOrderId}</td>
                <td className="border border-gray-300 px-4 py-2">₹{order.totalAmount}</td>
                <td className="border border-gray-300 px-4 py-2">{order.status}</td>
                <td className="border border-gray-300 px-4 py-2">{order.paymentMethod}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex flec-col justify-center items-center gap-2 space-x-2">
                  <button
                    onClick={() => router.push(`/admin/dashboard/users/${order.userId}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default OrdersPage;
