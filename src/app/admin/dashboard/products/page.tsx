"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  _id: string;
  title: string;
  images: string[];
  tags: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  price: number;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products/getAllProducts"); // Replace with your API route
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <button className="bg-green-300 px-2 py-1 rounded-md fixed right-2"><Link href="/admin/dashboard/products/add">Add Product</Link></button>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4">Products</h1>
        <table className="table w-full text-gray-700">
          <thead>
            <tr className="text-left border-b">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Images</th>
              <th className="px-4 py-2">Tags</th>
              <th className="px-4 py-2">Size</th>
              <th className="px-4 py-2">Color</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{product.title}</td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${product.title} image ${index}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2">{product.tags.join(", ")}</td>
                <td className="px-4 py-2">{product.sizes.join(", ")}</td>
                <td className="px-4 py-2">{product.colors.join(", ")}</td>
                <td className="px-4 py-2">{product.stock}</td>
                <td className="px-4 py-2">${product.price}</td>
                <td className="px-4 py-2">
                  <Link
                    href={`/admin/dashboard/products/${product._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;
