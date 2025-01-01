"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/SideBar";

interface Size {
  size: string;
  stock: number;
}

interface Product {
  _id: string;
  title: string;
  images: string[];
  tags: string[];
  sizes: Size[]; // Sizes now include stock information
  stock: number; // Total stock
  price: number;
  discountedPrice?: number;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products/getAllProducts");
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    const confirmed = confirm("Are you sure you want to delete this product?");

    if (confirmed) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== productId)
          );
        } else {
          alert("Failed to delete the product. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("An error occurred while deleting the product.");
      }
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 p-4 sm:p-6">
      <Sidebar />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
        <Link href="/admin/dashboard/products/add">
          <button className="mt-4 sm:mt-0 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md">
            Add Product
          </button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by product name..."
          className="w-full p-3 border border-gray-300 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
        <table className="table-auto w-full text-sm hidden sm:table">
          <thead>
            <tr className="text-left border-b border-gray-300 dark:border-gray-700">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Images</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Sizes</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Discounted Price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product._id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
              >
                <td className="px-4 py-3 font-medium">{product.title}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${product.title} image ${index}`}
                        className="w-16 h-16 object-cover rounded-md border border-gray-300 dark:border-gray-700"
                      />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">{product.tags.join(", ")}</td>
                <td className="px-4 py-3">
                  {product.sizes
                    .map((size) => `${size.size} (${size.stock})`)
                    .join(", ")}
                </td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  {product.discountedPrice
                    ? `$${product.discountedPrice.toFixed(2)}`
                    : "N/A"}
                </td>
                <td className="px-4 py-3 flex space-x-2">
                  <Link
                    href={`/admin/dashboard/products/${product._id}`}
                    className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Card View for Small Screens */}
        <div className="grid grid-cols-1 sm:hidden gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-md"
            >
              <h3 className="text-lg font-bold">{product.title}</h3>
              <div className="flex gap-2 mt-2">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} image ${index}`}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                ))}
              </div>
              <p className="mt-2 text-sm">Tags: {product.tags.join(", ")}</p>
              <p className="mt-1 text-sm">
                Sizes:{" "}
                {product.sizes
                  .map((size) => `${size.size} (${size.stock})`)
                  .join(", ")}
              </p>
              <p className="mt-1 text-sm">Stock: {product.stock}</p>
              <p className="mt-1 text-sm">Price: ${product.price.toFixed(2)}</p>
              <p className="mt-1 text-sm">
                Discounted Price:{" "}
                {product.discountedPrice
                  ? `$${product.discountedPrice.toFixed(2)}`
                  : "N/A"}
              </p>
              <div className="mt-4 flex space-x-2">
                <Link
                  href={`/admin/dashboard/products/${product._id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-6">
            No products found. Try searching for a different product.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
