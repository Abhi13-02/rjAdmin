"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  images: string[];
}

interface ShippingAddress {
  [key: string]: any; // Adjust based on the schema
}

interface Order {
  _id: string;
  status: string;
  totalAmount: number;
  shiprocketOrderId: string;
  shippingAddress: ShippingAddress;
  paymentMethod: "COD" | "Prepaid";
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const STATUS_STYLES: Record<string, string> = {
  CANCELED:
    "bg-red-100 border-red-500 text-red-700 dark:bg-red-900 dark:border-red-400 dark:text-red-200",
  SELFFULFILLED:
    "bg-gray-100 border-gray-500 text-gray-700 dark:bg-gray-800 dark:border-gray-400 dark:text-gray-200",
  NEW:
    "bg-white border-blue-500 dark:bg-gray-700 dark:border-blue-400 dark:text-white",
};

const UserOrdersPage: React.FC = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (userId) {
      const fetchOrders = async () => {
        try {
          const response = await fetch(`/api/users/orders?userId=${userId}`);
          if (!response.ok) {
            console.error("Failed to fetch orders");
            return;
          }
          const data = await response.json();
          console.log(data);
          setOrders(data);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };

      fetchOrders();
    }
  }, [userId]);

  // Toggle expansion when clicking anywhere on the card
  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Render shipping address key-value pairs
  const renderShippingAddress = (address: ShippingAddress) => (
    <div className="text-sm">
      {Object.entries(address).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {value}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full min-h-screen p-4 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">
        User Orders
      </h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No orders found.
        </p>
      ) : (
        orders.map((order) => {
          const statusClass = STATUS_STYLES[order.status] || STATUS_STYLES["NEW"];
          return (
            <div
              key={order._id}
              onClick={() => toggleOrder(order._id)}
              className={`w-full cursor-pointer border p-4 mb-6 rounded-lg shadow-md transition-all ${statusClass}`}
            >
              {/* Always visible header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h2 className="text-lg font-semibold">Order ID: {order.shiprocketOrderId}</h2>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ${order.totalAmount}
                  </p>
                  <p>
                    <strong>Payment Method:</strong> {order.paymentMethod}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Updated At:</strong>{" "}
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
                  <div className="mt-2">
                    {expandedOrders[order._id] ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </div>
                </div>
              </div>
              {/* Expanded content shows shipping address and order items */}
              {expandedOrders[order._id] && (
                <div className="mt-4">
                  <div className="mb-4">
                    <strong>Shipping Address:</strong>
                    <div className="ml-4 mt-1">
                      {renderShippingAddress(order.shippingAddress)}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Order Items:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order._id}-item-${index}`}
                        className="border p-3 rounded-md flex flex-col bg-white dark:bg-gray-800 dark:text-gray-200 shadow"
                      >
                        <div className="mb-2">
                          {item.images && item.images.length > 0 && (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-32 object-cover rounded-md"
                            />
                          )}
                        </div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p>
                          <strong>Price:</strong> ${item.price}
                        </p>
                        <p>
                          <strong>Quantity:</strong> {item.quantity}
                        </p>
                        <p>
                          <strong>Size:</strong> {item.size}
                        </p>
                        {item.images && item.images.length > 1 && (
                          <div className="mt-2">
                            <strong className="text-sm">
                              Additional Images:
                            </strong>
                            <div className="flex space-x-2 mt-1 overflow-x-auto">
                              {item.images.slice(1).map((img, idx) => (
                                <img
                                  key={`${item.productId}-img-${idx}`}
                                  src={img}
                                  alt={`${item.name} image ${idx + 2}`}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default UserOrdersPage;
