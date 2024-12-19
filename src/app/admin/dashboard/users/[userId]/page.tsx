"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Item {
  name: string;
  quantity: number;
  price: number;
  color: string;
}

interface Order {
  orderId: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: Item[];
  newStatus?: string; // Add this line to define the newStatus property
}

const STATUS_OPTIONS = ["pending", "shipped", "delivered", "cancelled"];

const UserOrdersPage = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (userId) {
      const fetchOrders = async () => {
        const response = await fetch(`/api/users/order?userId=${userId}`);
        const data = await response.json();
        setOrders(data);
      };

      fetchOrders();
    }
  }, [userId]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, newStatus } : order
      )
    );
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/updateStatus`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, newStatus }),
      });

      if (response.ok) {
        alert("Order status updated successfully.");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert("Failed to update order status.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("An error occurred while updating the status.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Orders</h1>
      {orders.map((order) => (
        <div key={order.orderId} className="border p-4 mb-4 rounded-lg shadow">
          <h3 className="font-bold text-lg">Order ID: {order.orderId}</h3>
          <p>Status: {order.status}</p>
          <p>Total Amount: ${order.totalAmount}</p>
          <p>Created At: {new Date(order.createdAt).toLocaleDateString()}</p>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                {item.name} - {item.quantity} pcs - ${item.price} - {item.color}
              </li>
            ))}
          </ul>
          <div className="mt-2">
            <select
              value={order.newStatus || order.status}
              onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
              className="border p-2 rounded"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              onClick={() =>
                handleUpdateStatus(order.orderId, order.newStatus || order.status)
              }
              className={`ml-2 px-4 py-2 rounded text-white ${
                order.newStatus && order.newStatus !== order.status
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={!order.newStatus || order.newStatus === order.status}
            >
              Update
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserOrdersPage;
